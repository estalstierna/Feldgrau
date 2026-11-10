"""Generate the Chapter VI map of Germany (1942) from real latitude/longitude data.

Prints a JS snippet for SIM.MAPS.germany and the projected positions of the home towns.
Projection: equirectangular, corrected for latitude 51.5°, fitted to the 320 x 250 viewBox.

Usage: python3 tools/make_map_germany.py
"""
import math

LAT_MAX, LAT_MIN = 56.0, 47.0
LON_MIN = 3.3
KY = 250 / (LAT_MAX - LAT_MIN)
KX = KY * math.cos(math.radians(51.5))


def p(lat, lon):
    return round((lon - LON_MIN) * KX, 1), round((LAT_MAX - lat) * KY, 1)


def path(points, close=False):
    d = ' '.join(('M' if i == 0 else 'L') + f'{x},{y}' for i, (x, y) in enumerate(p(a, b) for a, b in points))
    return d + (' Z' if close else '')


# Sea west of Denmark and Germany (North Sea), traced from the top-left corner.
NORTH_SEA = [(56.0, 3.3), (56.0, 8.15), (55.56, 8.08), (55.47, 8.45), (55.1, 8.55), (54.9, 8.62), (54.48, 8.9), (54.35, 8.6),
             (54.13, 8.86), (53.9, 9.0), (53.87, 8.7), (53.55, 8.55), (53.4, 8.15), (53.7, 7.8), (53.65, 7.2), (53.3, 7.2),
             (53.45, 6.7), (53.4, 6.0), (53.15, 5.4), (52.95, 4.75), (52.4, 4.55), (52.1, 4.25), (51.9, 4.05), (51.5, 3.55),
             (51.35, 3.3)]
# The Baltic, the Kattegat and the Belts, with Zealand and the south of Sweden cut out.
BALTIC = [(56.0, 10.25), (55.7, 9.6), (55.5, 9.7), (55.49, 9.5), (55.25, 9.5), (55.04, 9.42), (54.9, 9.8), (54.79, 9.45),
          (54.6, 10.0), (54.47, 9.85), (54.33, 10.15), (54.4, 10.6), (54.5, 11.0), (54.35, 11.1), (54.05, 10.85), (53.96, 10.87),
          (54.0, 11.3), (53.9, 11.45), (54.15, 11.9), (54.18, 12.08), (54.38, 12.4), (54.47, 12.55), (54.4, 13.0),
          (54.65, 13.15), (54.68, 13.43), (54.45, 13.7), (54.25, 13.6), (54.15, 13.8), (54.0, 14.15), (53.92, 14.27),
          (54.05, 14.7), (54.18, 15.57), (54.58, 16.86), (54.77, 17.55), (54.83, 18.33), (54.6, 18.4), (54.52, 18.55),
          (54.35, 18.7), (54.4, 19.2), (54.6, 19.6), (54.65, 19.9), (54.95, 20.2), (54.95, 20.55), (55.4, 21.05),
          (55.72, 21.1), (56.0, 21.05), (56.0, 14.3), (55.93, 14.3), (55.55, 14.2), (55.42, 13.82), (55.38, 13.15),
          (55.4, 12.83), (55.6, 13.0), (56.0, 12.75), (56.0, 12.62), (55.68, 12.6), (55.45, 12.2), (55.3, 12.45),
          (55.1, 12.15), (55.18, 11.75), (55.33, 11.15), (55.68, 11.1), (55.9, 11.5), (56.0, 11.75)]
ISLANDS = {
    'Funen': [(55.6, 10.1), (55.55, 10.6), (55.3, 10.8), (55.05, 10.65), (55.05, 10.1), (55.2, 9.75), (55.45, 9.8)],
    'Lolland': [(54.9, 11.0), (54.95, 11.5), (54.85, 11.85), (54.65, 11.85), (54.65, 11.3), (54.8, 11.0)],
    'Falster': [(54.95, 11.9), (54.85, 12.1), (54.6, 11.95), (54.65, 11.85)],
    'Bornholm': [(55.3, 14.75), (55.25, 15.15), (55.0, 15.1), (55.05, 14.7)],
}
# Germany's 1937 border (the Reich before the annexations), west, south and east.
BORDER = [(54.83, 9.43), (54.9, 8.65)], [
    (53.25, 7.2), (52.9, 7.1), (52.45, 7.05), (52.1, 6.85), (51.85, 6.2), (51.5, 6.1), (51.0, 5.9), (50.75, 6.0),
    (50.4, 6.1), (50.0, 6.15), (49.45, 6.35), (49.2, 6.7), (49.1, 7.5), (48.97, 8.2), (48.6, 7.8), (48.0, 7.55),
    (47.58, 7.6), (47.6, 8.6), (47.6, 9.4), (47.55, 9.75), (47.4, 10.4), (47.5, 11.0), (47.6, 12.2), (47.8, 12.9),
    (48.2, 13.0), (48.57, 13.45), (48.8, 13.8), (49.2, 13.0), (49.6, 12.5), (50.1, 12.3), (50.25, 12.2), (50.45, 12.9),
    (50.75, 13.6), (50.9, 14.3), (51.0, 14.8), (50.8, 15.2), (50.6, 16.2), (50.45, 16.9), (50.2, 17.6), (49.95, 18.3),
    (50.2, 18.65), (50.5, 18.6), (51.0, 18.2), (51.3, 17.9), (51.6, 16.9), (51.8, 16.3), (52.2, 15.8), (52.35, 15.75),
    (52.9, 16.2), (53.15, 16.75), (53.7, 17.3), (54.2, 17.5), (54.8, 17.7)], [
    (54.35, 19.4), (54.0, 19.6), (53.6, 19.6), (53.4, 19.9), (53.2, 20.5), (53.2, 21.5)]
RIVERS = {
    'Rhine': [(47.56, 7.59), (48.6, 7.8), (49.49, 8.47), (50.0, 8.27), (50.36, 7.6), (50.94, 6.96), (51.23, 6.77), (51.85, 6.15), (51.9, 5.4), (51.9, 4.4)],
    'Elbe': [(50.85, 14.25), (51.05, 13.74), (52.13, 11.63), (52.95, 11.2), (53.55, 10.0), (53.9, 9.0)],
    'Oder': [(50.1, 18.2), (51.1, 17.03), (51.66, 16.08), (52.35, 14.55), (53.43, 14.55), (53.8, 14.3)],
    'Danube': [(48.0, 8.5), (48.4, 10.0), (49.0, 12.1), (48.57, 13.46), (48.2, 16.37), (48.0, 17.5)],
    'Weser': [(51.4, 9.65), (52.1, 9.2), (53.08, 8.8), (53.55, 8.55)],
    'Vistula': [(50.05, 19.94), (50.6, 21.4), (51.4, 21.45), (52.23, 21.0), (52.6, 19.7), (53.0, 18.6), (53.5, 18.75), (54.3, 18.9)],
}
TOWNS = [('Hamburg', 53.55, 10.0, 'end'), ('Berlin', 52.52, 13.4, 'start'), ('Munich', 48.14, 11.58, 'start'),
         ('Breslau', 51.11, 17.03, 'start'), ('Stolp', 54.46, 17.03, 'end'), ('Lübeck', 53.87, 10.69, 'start'),
         ('Rostock', 54.09, 12.13, 'start'), ('Cologne', 50.94, 6.96, 'start'), ('Copenhagen', 55.68, 12.57, 'end'),
         ('Danzig', 54.35, 18.65, 'start'), ('Warsaw', 52.23, 21.0, 'end'), ('Vienna', 48.21, 16.37, 'start'),
         ('Prague', 50.08, 14.42, 'start'), ('Stuttgart', 48.78, 9.18, 'start')]
LABELS = [('GERMANY', 51.1, 9.0, 'm-country'), ('DENMARK', 55.12, 8.7, 'm-country m-small'), ('SWEDEN', 55.72, 13.35, 'm-country m-small'),
          ('NETHERLANDS', 52.6, 5.3, 'm-country m-small'), ('BELGIUM', 50.55, 4.0, 'm-country m-small'), ('FRANCE', 48.2, 4.2, 'm-country m-small'),
          ('SWITZERLAND', 47.2, 7.0, 'm-country m-small'), ('PROTECTORATE', 49.5, 14.6, 'm-country m-small'),
          ('GEN. GOVT.', 50.55, 21.35, 'm-country m-small', 'end'), ('E. PRUSSIA', 53.95, 21.35, 'm-country m-small', 'end'),
          ('AUSTRIA', 47.55, 13.3, 'm-country m-small')]
SEAS = [('North Sea', 54.9, 4.8), ('Baltic Sea', 55.2, 16.2)]
HOMES = {'home_berlin': (52.55, 13.36), 'home_hamburg': (53.55, 9.94), 'home_munich': (48.14, 11.58), 'home_breslau': (51.11, 17.03), 'home_stolp': (54.46, 17.03)}

parts = ['<rect width="320" height="250" class="m-land"/>']
parts.append(f'<path d="{path(NORTH_SEA)} L0,0 Z" class="m-sea"/>')
parts.append(f'<path d="{path(BALTIC, True)}" class="m-sea"/>')
for pts in ISLANDS.values():
    parts.append(f'<path d="{path(pts, True)}" class="m-land m-coast"/>')
for pts in RIVERS.values():
    parts.append(f'<path d="{path(pts)}" class="m-river" opacity=".7"/>')
for pts in BORDER:
    parts.append(f'<path d="{path(pts)}" class="m-border"/>')
for name, lat, lon in SEAS:
    x, y = p(lat, lon)
    parts.append(f'<text x="{x}" y="{y}" class="m-sea-label">{name}</text>')
for name, lat, lon, cls, *anchor in LABELS:
    x, y = p(lat, lon)
    a = f' text-anchor="{anchor[0]}"' if anchor else ''
    parts.append(f'<text x="{x}" y="{y}" class="{cls}"{a}>{name}</text>')
base = '\n    '.join(parts)
towns = ', '.join(f"[{p(lat, lon)[0]}, {p(lat, lon)[1]}, '{n}'" + (", 'end'" if a == 'end' else '') + ']' for n, lat, lon, a in TOWNS)
print("SIM.MAPS.germany = () => ({\n  label: 'Map of Germany and its neighbours, 1942',\n  base: `" + base + "`,\n  towns: [" + towns + "]\n});")
print('// PLACES')
for k, (lat, lon) in HOMES.items():
    x, y = p(lat, lon)
    print(f'{k}: x {x}, y {y}')
