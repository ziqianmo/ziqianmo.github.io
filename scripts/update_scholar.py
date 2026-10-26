#!/usr/bin/env python3
"""
Fetch Google Scholar author metrics and update data/scholar.json.
On scrape failure, CAPTCHA, or empty metrics: do not overwrite existing JSON.
"""

from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from html import unescape
from pathlib import Path

SCHOLAR_ID = "cuiFGOAAAAAJ"
OUTPUT = Path(__file__).resolve().parent.parent / "data" / "scholar.json"
PROFILE_URL = (
    f"https://scholar.google.com/citations?user={SCHOLAR_ID}&hl=en&cstart=0&pagesize=100"
)
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


def log(msg: str) -> None:
    print(msg, file=sys.stderr)


def fetch_html(url: str) -> str | None:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            charset = resp.headers.get_content_charset() or "utf-8"
            return resp.read().decode(charset, errors="replace")
    except (urllib.error.URLError, TimeoutError, OSError) as e:
        log(f"warning: fetch failed: {e}")
        return None


def strip_tags(html: str) -> str:
    text = re.sub(r"<[^>]+>", "", html)
    return unescape(text).strip()


def parse_int(text: str) -> int | None:
    digits = re.sub(r"[^\d]", "", text)
    if not digits:
        return None
    return int(digits)


def looks_like_block(html: str) -> bool:
    lower = html.lower()
    if "unusual traffic" in lower or "captcha" in lower:
        return True
    if "gsc_rsb_std" not in lower and "gsc_a_at" not in lower:
        return True
    return False


def parse_metrics_table(html: str) -> dict[str, int] | None:
    """Parse gsc_rsb_std rows: Citations (all / since), h-index, i10-index."""
    block = re.search(
        r'<table[^>]*id="gsc_rsb_st"[^>]*>(.*?)</table>',
        html,
        re.DOTALL | re.IGNORECASE,
    )
    if not block:
        block = re.search(
            r'<table[^>]*class="[^"]*gsc_rsb_std[^"]*"[^>]*>(.*?)</table>',
            html,
            re.DOTALL | re.IGNORECASE,
        )
    if not block:
        return None

    table = block.group(1)
    rows = re.findall(r"<tr[^>]*>(.*?)</tr>", table, re.DOTALL | re.IGNORECASE)
    metrics: dict[str, int] = {}

    for row in rows:
        cells = re.findall(r"<td[^>]*>(.*?)</td>", row, re.DOTALL | re.IGNORECASE)
        if len(cells) < 2:
            continue
        label = strip_tags(cells[0]).lower()
        all_val = parse_int(strip_tags(cells[1]))
        since_val = parse_int(strip_tags(cells[2])) if len(cells) > 2 else None

        if "citation" in label and all_val is not None:
            metrics["citations"] = all_val
            if since_val is not None:
                metrics["citations_since_2021"] = since_val
        elif "h-index" in label or label == "h-index":
            if all_val is not None:
                metrics["h_index"] = all_val
        elif "i10-index" in label or "i10" in label:
            if all_val is not None:
                metrics["i10_index"] = all_val

    required = {"citations", "h_index", "i10_index"}
    if not required.issubset(metrics.keys()):
        return None
    if metrics["citations"] == 0 and metrics["h_index"] == 0:
        return None
    return metrics


def parse_year_graph(html: str) -> list[dict[str, int]]:
    """Parse bar chart years from gsc_g_t / gsc_g_al."""
    years = [
        int(m)
        for m in re.findall(
            r'class=["\']gsc_g_t["\'][^>]*>\s*(\d{4})',
            html,
            re.IGNORECASE,
        )
    ]

    counts: list[int] = []
    for m in re.finditer(
        r'class=["\']gsc_g_al["\'][^>]*>([^<]*)</a>',
        html,
        re.IGNORECASE,
    ):
        val = parse_int(strip_tags(m.group(1)))
        if val is not None:
            counts.append(val)

    graph: list[dict[str, int]] = []
    for i, year in enumerate(years):
        if i < len(counts):
            graph.append({"year": year, "citations": counts[i]})
    return graph


def parse_papers(html: str) -> list[dict[str, int | str]]:
    papers: list[dict[str, int | str]] = []
    for row in re.finditer(
        r'<tr class="gsc_a_tr"[^>]*>(.*?)</tr>',
        html,
        re.DOTALL | re.IGNORECASE,
    ):
        chunk = row.group(1)
        title_m = re.search(
            r'class="gsc_a_at"[^>]*>(.*?)</a>',
            chunk,
            re.DOTALL | re.IGNORECASE,
        )
        cite_m = re.search(
            r'class="gsc_a_ac[^"]*"[^>]*>(.*?)</a>',
            chunk,
            re.DOTALL | re.IGNORECASE,
        )
        year_m = re.search(
            r'class="gsc_a_y"[^>]*><span[^>]*>(\d{4})</span>',
            chunk,
            re.IGNORECASE,
        )
        if not title_m:
            continue
        title = strip_tags(title_m.group(1))
        cites = parse_int(strip_tags(cite_m.group(1))) if cite_m else 0
        if cites is None:
            cites = 0
        entry: dict[str, int | str] = {"title": title, "citations": cites}
        if year_m:
            entry["year"] = int(year_m.group(1))
        papers.append(entry)
    return papers


def build_payload(html: str) -> dict | None:
    if looks_like_block(html):
        log("warning: page looks blocked or missing Scholar markup")
        return None

    metrics = parse_metrics_table(html)
    if not metrics:
        log("warning: could not parse metrics table")
        return None

    payload: dict = {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "scholar_id": SCHOLAR_ID,
        **metrics,
        "year_graph": parse_year_graph(html),
        "papers": parse_papers(html),
    }
    if "citations_since_2021" not in payload:
        payload["citations_since_2021"] = payload["citations"]
    return payload


def main() -> int:
    html = fetch_html(PROFILE_URL)
    if not html:
        log("warning: keeping existing scholar.json")
        return 0

    payload = build_payload(html)
    if not payload:
        log("warning: scrape incomplete; keeping existing scholar.json")
        return 0

    if OUTPUT.exists():
        try:
            existing = json.loads(OUTPUT.read_text(encoding="utf-8"))
            if not payload.get("year_graph") and existing.get("year_graph"):
                payload["year_graph"] = existing["year_graph"]
        except (json.JSONDecodeError, OSError):
            pass

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    log(f"updated {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
