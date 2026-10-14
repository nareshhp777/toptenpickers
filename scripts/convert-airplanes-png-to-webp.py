import os
from PIL import Image

AIRPLANES_DIR = os.path.join(os.path.dirname(__file__), '..', 'airplanes')

def convert_pngs():
    converted_count = 0
    for root, dirs, files in os.walk(AIRPLANES_DIR):
        for f in sorted(files):
            if f.lower().endswith('.png'):
                png_path = os.path.join(root, f)
                base_name = os.path.splitext(f)[0]
                webp_path = os.path.join(root, f"{base_name}.webp")
                
                print(f"Processing: {png_path}")
                with Image.open(png_path) as img:
                    img = img.convert('RGB')
                    w, h = img.size
                    
                    # Target standard showcase dimensions (1264x848 for 3:2, 1200x896 for 4:3)
                    if w > 1300:
                        new_w = w // 2
                        new_h = h // 2
                        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
                        print(f"  Resized from ({w}, {h}) -> ({new_w}, {new_h})")
                    
                    img.save(webp_path, 'WEBP', quality=85, method=6)
                    file_size = os.path.getsize(webp_path)
                    print(f"  Saved {webp_path} ({file_size // 1024} KB)")
                
                os.remove(png_path)
                print(f"  Removed source PNG: {png_path}")
                converted_count += 1
                
    print(f"\nCompleted! Total images converted: {converted_count}")

if __name__ == '__main__':
    convert_pngs()
