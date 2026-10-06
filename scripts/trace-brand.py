"""Extract solid 3D contours from the supplied PNG; never modify that image."""
from pathlib import Path
from PIL import Image
import hashlib
import json
import math

root = Path(__file__).resolve().parent.parent
source = root / 'assets/StackOrcs.png'
image = Image.open(source).convert('RGB')
w, h = image.size
pixels = image.load()
mask = {(x, y) for y in range(h) for x in range(w)
        if pixels[x, y][0] > 200 and pixels[x, y][1] < 170 and pixels[x, y][2] < 90}
edges = {}
for x, y in mask:
    for neighbor, start, end in [((x,y-1),(x,y),(x+1,y)),((x+1,y),(x+1,y),(x+1,y+1)),
                                 ((x,y+1),(x+1,y+1),(x,y+1)),((x-1,y),(x,y+1),(x,y))]:
        if neighbor not in mask:
            edges.setdefault(start, []).append(end)

def area(points):
    return sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(points,points[1:]+points[:1])) / 2

def simplify(points, epsilon=1.3):
    if len(points) < 3:
        return points
    a, b = points[0], points[-1]
    dx, dy = b[0]-a[0], b[1]-a[1]
    length = math.hypot(dx,dy)
    distances = [abs(dy*p[0]-dx*p[1]+b[0]*a[1]-b[1]*a[0])/length if length else math.dist(a,p) for p in points]
    i = max(range(len(points)), key=distances.__getitem__)
    if distances[i] > epsilon:
        return simplify(points[:i+1],epsilon)[:-1]+simplify(points[i:],epsilon)
    return [a,b]

loops = []
while edges:
    start = next(iter(edges))
    loop, current = [start], start
    while True:
        ends = edges[current]
        following = ends.pop()
        if not ends:
            del edges[current]
        current = following
        if current == start:
            break
        loop.append(current)
    if abs(area(loop)) > 80:
        # Split a closed loop across its farthest point before simplifying.
        middle = max(range(len(loop)),key=lambda i:math.dist(start,loop[i]))
        loop = simplify(loop[:middle+1])[:-1]+simplify(loop[middle:]+[start])[:-1]
        loops.append(loop)

def contains(points, point):
    x, y = point
    inside = False
    for a,b in zip(points,points[1:]+points[:1]):
        if (a[1]>y)!=(b[1]>y) and x < (b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]:
            inside = not inside
    return inside

outers = [loop for loop in loops if area(loop)>0]
holes = [loop for loop in loops if area(loop)<0]
normalize = lambda points:[[round((x-w/2)/250,5),round((h/2-y)/250,5)] for x,y in points]
data = {'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'shapes':[]}
for outer in sorted(outers,key=lambda loop:-area(loop)):
    data['shapes'].append({'outline':normalize(outer),'holes':[normalize(hole) for hole in holes if contains(outer,hole[0])]})
(root/'src/brand-contours.json').write_text(json.dumps(data,separators=(',',':')),encoding='utf-8')
print(f"Traced {len(outers)} shapes, {len(holes)} openings, {sum(len(loop) for loop in loops)} vertices from the original logo.")
