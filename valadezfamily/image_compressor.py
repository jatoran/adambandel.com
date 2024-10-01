from PIL import Image
import os

def compress_image(input_path, output_path, quality=85):
    img = Image.open(input_path)
    img.save(output_path, optimize=True, quality=quality)

def batch_compress_images(input_folder, output_folder, quality=85):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(input_folder):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            input_path = os.path.join(input_folder, filename)
            output_path = os.path.join(output_folder, filename)
            compress_image(input_path, output_path, quality)
            print(f"Compressed: {filename}")

input_folder = r'C:\Users\Jatora\Desktop\asdf'
output_folder = r'C:\Users\Jatora\Desktop\asdf\ff'
quality = 85  # Adjust the quality between 1-100 (lower means more compression)

batch_compress_images(input_folder, output_folder, quality)
