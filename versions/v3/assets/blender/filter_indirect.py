"""Low-pass the Monte Carlo irradiance data (not albedo/detail) for web delivery.
Run with Python + Pillow after bake_indirect.py. Original bake remains in .blend.
"""
from pathlib import Path
from PIL import Image, ImageFilter
root=Path(__file__).resolve().parents[2]
for mode in ['day','night']:
 path=root/'public/textures'/f'court-indirect-{mode}.png'
 with Image.open(path) as image:
  assert max(hi for lo,hi in image.convert('RGB').getextrema()) > 10, f'Empty indirect bake: {mode}'
  image.convert('RGB').filter(ImageFilter.GaussianBlur(2)).save(path,optimize=True)
