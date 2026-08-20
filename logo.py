from PIL import Image

src = Image.open("/tmp/logo_full.png").convert("RGBA")
W, H = src.size
mid = H // 2

def process(crop_box, out_path):
    im = crop_box.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            # Fondo blanco/casi blanco -> transparente
            if r > 232 and g > 232 and b > 232:
                px[x, y] = (r, g, b, 0)
    bbox = im.getbbox()
    if bbox:
        # pequeño margen
        pad = 20
        l, t, rt, bt = bbox
        l = max(0, l - pad); t = max(0, t - pad); rt = min(w, rt + pad); bt = min(h, bt + pad)
        im = im.crop((l, t, rt, bt))
    im.save(out_path)
    print(out_path, im.size)

top = src.crop((0, 0, W, mid))       # dorado
bottom = src.crop((0, mid, W, H))    # negro
process(top, "/Users/franco/Desktop/marztone/frontend/public/logo-dark.png")   # para modo oscuro
process(bottom, "/Users/franco/Desktop/marztone/frontend/public/logo-light.png") # para modo claro
print("LISTO")
