"""Workflow figures for this post — generator and single source of truth.

The seven figures are INLINE SVG in index.md (between `<!-- fig:N -->`
markers), not image files: inline SVG inherits the page's CSS custom
properties, so the figures follow the site's data-theme toggle exactly —
tokens for ink/subtle/hairline/field, fixed brand hues for the roles
(violet embedded / blue reviewer / teal external / green approved), the
brand-gradient diamond for the Domain Server.

One scene, seven states: the AI owner's security perimeter (tinted field +
dashed hairline) holds the Embedded Evaluator, Domain Server, and Internal
Reviewer; the External Evaluator stands outside. Idle actors dim. Step 7
crosses the boundary and shows the faint crowd of additional callers — the
post's thesis drawn (one expensive seat inside, scale outside).

Run:  python3 figures.py   (rewrites the marker blocks in index.md)
"""
import pathlib, re

W, H = 1240, 452
INK = "var(--text-headline)"
SUBTLE = "var(--text-subtle)"
HAIR = "var(--surface-foreground-high)"
FIELD = "var(--surface-foreground-lowest)"
BRIGHT = "var(--surface-background-bright)"
VIOLET, BLUE, TEAL, GREEN = "#937098", "#6976ae", "#52a8c5", "#3c9f8b"
GOLD, RED = "#f8c073", "#cc677b"
DIM = 0.26
F = "font-family='Inter, -apple-system, sans-serif'"

EXT, EMB, DS, IR = (150, 252), (520, 252), (800, 240), (1085, 252)

def person(cx, cy, hue, label, active):
    o = 1 if active else DIM
    name_fill = hue if active else INK
    return f"""<g opacity='{o}'>
<circle cx='{cx}' cy='{cy}' r='44' fill='{hue}' fill-opacity='0.13'/>
<circle cx='{cx}' cy='{cy}' r='44' fill='none' stroke='{hue}' stroke-width='{2.4 if active else 1.8}'/>
<circle cx='{cx}' cy='{cy-11}' r='12.5' fill='none' stroke='{hue}' stroke-width='2.4'/>
<path d='M {cx-21} {cy+25} C {cx-21} {cy+6} {cx+21} {cy+6} {cx+21} {cy+25}' fill='none' stroke='{hue}' stroke-width='2.4' stroke-linecap='round'/>
<text x='{cx}' y='{cy+70}' text-anchor='middle' {F} font-size='13.5' font-weight='600' fill='{name_fill}'>{label}</text>
</g>"""

def diamond(cx, cy, active, badge=None):
    o = 1 if active else DIM
    b = ""
    if badge:
        bw = 7.6 * len(badge) + 22
        b = f"""<rect x='{cx-bw/2}' y='{cy+60}' width='{bw}' height='21' rx='10.5' fill='{GREEN}'/>
<text x='{cx}' y='{cy+74.5}' text-anchor='middle' {F} font-size='11.5' font-weight='600' fill='#fcfcfd'>{badge}</text>"""
    return f"""<g opacity='{o}'>
<path d='M {cx} {cy-54} L {cx+54} {cy} L {cx} {cy+54} L {cx-54} {cy} Z' fill='url(#dg)' stroke='{INK}' stroke-width='1.4'/>
<text x='{cx}' y='{cy-2}' text-anchor='middle' {F} font-size='13' font-weight='700' fill='#ffffff'>Domain</text>
<text x='{cx}' y='{cy+14}' text-anchor='middle' {F} font-size='13' font-weight='700' fill='#ffffff'>Server</text>
{b}
</g>"""

def flow(x1, x2, y, hue, label, mk, above=True):
    """Arrow with its caption set as type on the line — no chip box."""
    ty = y - 10 if above else y + 21
    tx = (x1 + x2) / 2
    return f"""<line x1='{x1}' y1='{y}' x2='{x2}' y2='{y}' stroke='{hue}' stroke-width='2.2' marker-end='url(#{mk})'/>
<text x='{tx}' y='{ty}' text-anchor='middle' {F} font-size='13.5' font-weight='600' fill='{hue}'>{label}</text>"""

def thought(cx, cy, text):
    w = 7.8 * len(text) + 30
    return f"""<g>
<rect x='{cx-w/2}' y='{cy-16}' width='{w}' height='32' rx='16' fill='{BRIGHT}' stroke='{HAIR}' stroke-width='1.2'/>
<circle cx='{cx-w/2+8}' cy='{cy+25}' r='4' fill='{BRIGHT}' stroke='{HAIR}' stroke-width='1'/>
<circle cx='{cx-w/2}' cy='{cy+35}' r='2.5' fill='{BRIGHT}' stroke='{HAIR}' stroke-width='1'/>
<text x='{cx}' y='{cy+5}' text-anchor='middle' {F} font-size='13' fill='{INK}'>{text}</text>
</g>"""

def crowd(cx, cy, active):
    o = 0.45 if active else 0.1
    out = ""
    for dx, dy in [(-50, -33), (-62, 10), (-38, 43)]:
        out += f"""<g opacity='{o}'>
<circle cx='{cx+dx}' cy='{cy+dy}' r='15' fill='none' stroke='{TEAL}' stroke-width='1.6'/>
<circle cx='{cx+dx}' cy='{cy+dy-4}' r='4.2' fill='none' stroke='{TEAL}' stroke-width='1.6'/>
<path d='M {cx+dx-7.5} {cy+dy+8.5} C {cx+dx-7.5} {cy+dy+1} {cx+dx+7.5} {cy+dy+1} {cx+dx+7.5} {cy+dy+8.5}' fill='none' stroke='{TEAL}' stroke-width='1.6'/>
</g>"""
    return out

def scene(n, title, a, body):
    return f"""<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {W} {H}' role='img' aria-label='Step {n}: {title}' style='width:100%;height:auto' {F}>
<defs>
<linearGradient id='dg' x1='0' y1='0' x2='1' y2='1'>
<stop offset='0' stop-color='{GOLD}'/><stop offset='0.35' stop-color='{RED}'/>
<stop offset='0.7' stop-color='{BLUE}'/><stop offset='1' stop-color='{TEAL}'/>
</linearGradient>
<marker id='mv{n}' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='6.5' markerHeight='6.5' orient='auto-start-reverse'><path d='M 0 1 L 9 5 L 0 9' fill='none' stroke='{VIOLET}' stroke-width='1.9' stroke-linecap='round'/></marker>
<marker id='mb{n}' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='6.5' markerHeight='6.5' orient='auto-start-reverse'><path d='M 0 1 L 9 5 L 0 9' fill='none' stroke='{BLUE}' stroke-width='1.9' stroke-linecap='round'/></marker>
<marker id='mt{n}' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='6.5' markerHeight='6.5' orient='auto-start-reverse'><path d='M 0 1 L 9 5 L 0 9' fill='none' stroke='{TEAL}' stroke-width='1.9' stroke-linecap='round'/></marker>
</defs>
<text x='28' y='50' {F} font-size='38' font-weight='800' fill='{HAIR}'>{n}</text>
<text x='{28 + (34 if n < 10 else 56)} ' y='45' {F} font-size='20' font-weight='700' fill='{INK}'>{title}</text>
<rect x='372' y='78' width='840' height='356' rx='14' fill='{FIELD}' fill-opacity='0.55'/>
<rect x='372' y='78' width='840' height='356' rx='14' fill='none' stroke='{HAIR}' stroke-width='1.4' stroke-dasharray='8 7'/>
<text x='392' y='106' {F} font-size='12.5' fill='{SUBTLE}'>AI owner&#8217;s security perimeter</text>
{crowd(*EXT, a.get('crowd', False))}
{person(*EXT, TEAL, 'External Evaluator', a['ext'])}
{person(*EMB, VIOLET, 'Embedded Evaluator', a['emb'])}
{diamond(*DS, a['ds'], a.get('badge'))}
{person(*IR, BLUE, 'Internal Reviewer', a['ir'])}
{body}
</svg>"""

steps = [
 (1, "AI owner decides on the evaluation environment",
  dict(ext=False, emb=False, ds=False, ir=True),
  thought(1085, 140, "Which setup do we need?")),
 (2, "AI owner sets up the evaluation environment",
  dict(ext=False, emb=False, ds=True, ir=True),
  flow(1030, 866, 240, BLUE, "launch Domain Server", "mb2")),
 (3, "AI owner uploads what will be evaluated",
  dict(ext=False, emb=False, ds=True, ir=True),
  flow(1030, 866, 240, BLUE, "datasets · user logs", "mb3")),
 (4, "Embedded evaluator builds the evaluation",
  dict(ext=False, emb=True, ds=True, ir=False),
  flow(576, 734, 222, VIOLET, "explore real data", "mv4")
  + flow(734, 576, 268, VIOLET, "write evaluation job", "mv4", above=False)),
 (5, "The job is submitted, reviewed and run",
  dict(ext=False, emb=True, ds=True, ir=True),
  flow(576, 1024, 172, VIOLET, "submit job for review", "mv5")
  + flow(1030, 866, 292, BLUE, "approve &#10003; and run", "mb5", above=False)),
 (6, "Internal reviewer registers the job for re-use",
  dict(ext=False, emb=False, ds=True, ir=True, badge="approved endpoint"),
  flow(1030, 866, 240, BLUE, "register as endpoint", "mb6")),
 (7, "External evaluators re-run the approved job",
  dict(ext=True, emb=False, ds=True, ir=False, badge="approved endpoint", crowd=True),
  flow(200, 758, 192, TEAL, "call with parameters", "mt7")
  + flow(742, 200, 348, TEAL, "filtered results only", "mt7", above=False)),
]

here = pathlib.Path(__file__).parent
idx = here / "index.md"
s = idx.read_text()
for n, title, a, body in steps:
    svg = scene(n, title, a, body).replace("\n", "")
    block = f"<!-- fig:{n} -->\n{svg}\n<!-- /fig:{n} -->"
    if f"<!-- fig:{n} -->" in s:
        s = re.sub(rf"<!-- fig:{n} -->.*?<!-- /fig:{n} -->", block, s, flags=re.S)
    else:
        s = s.replace(f"![](./media/figure-{n}.svg)", block)
    print(f"fig {n}: {title}")
idx.write_text(s)
print("index.md updated")
