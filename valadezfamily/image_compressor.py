import os
import concurrent.futures
from PIL import Image, ImageFile, ImageOps, ExifTags
from tqdm import tqdm

# To handle large or truncated images
ImageFile.LOAD_TRUNCATED_IMAGES = True

# --------------------------- Configuration --------------------------- #
# Set your input and output directories here
INPUT_FOLDER = r'C:\Users\Jatora\Desktop\asdf'          # Path to input images
OUTPUT_FOLDER = r'C:\Users\Jatora\Desktop\asdf\ff'      # Path to save compressed images

# Compression settings
WEBP_QUALITY = 80            # WebP quality (1-100). Lower means more compression
MAX_DIMENSION = 1920         # Maximum width or height in pixels

# Number of parallel threads
MAX_WORKERS = os.cpu_count() or 4

# --------------------------------------------------------------------- #

# Determine the appropriate resampling filter
try:
    from PIL import Resampling
    RESAMPLE_FILTER = Resampling.LANCZOS
except ImportError:
    RESAMPLE_FILTER = Image.LANCZOS  # For older Pillow versions

def resize_image(img, max_dimension):
    """Resize image while maintaining aspect ratio."""
    width, height = img.size
    if max(width, height) <= max_dimension:
        return img  # No resizing needed

    if width > height:
        new_width = max_dimension
        new_height = int((max_dimension / width) * height)
    else:
        new_height = max_dimension
        new_width = int((max_dimension / height) * width)

    return img.resize((new_width, new_height), RESAMPLE_FILTER)

def reset_image_orientation(img):
    """Reset image orientation to default (no rotation) based on EXIF data."""
    try:
        exif = img._getexif()
        if exif is not None:
            for tag, value in exif.items():
                decoded_tag = ExifTags.TAGS.get(tag, tag)
                if decoded_tag == 'Orientation':
                    if value != 1:
                        # Rotate the image to the correct orientation
                        img = ImageOps.exif_transpose(img)
                    break
    except AttributeError:
        # Image has no EXIF data
        pass
    return img

def convert_to_webp(input_path, output_path, webp_quality, max_dimension):
    """Resize and convert an image to WebP format without unintended rotation."""
    try:
        with Image.open(input_path) as img:
            img_format = img.format.upper()

            # Reset orientation to prevent unintended rotation
            img = reset_image_orientation(img)

            # Resize if necessary
            img = resize_image(img, max_dimension)

            # Enhance image contrast (optional)
            img = ImageOps.autocontrast(img)

            # Strip EXIF data to prevent further issues
            img.info.pop('exif', None)

            # Convert to WebP
            img.save(output_path, format='WEBP', quality=webp_quality, method=6, lossless=False)
        
        print(f"Processed: {os.path.basename(input_path)}")
    
    except Exception as e:
        print(f"Failed to process {os.path.basename(input_path)}: {e}")

def batch_convert_images():
    """Batch process images: resize and convert to WebP."""
    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)

    # Gather list of image files
    image_extensions = ('.jpg', '.jpeg', '.png')
    image_files = [
        os.path.join(INPUT_FOLDER, f)
        for f in os.listdir(INPUT_FOLDER)
        if f.lower().endswith(image_extensions)
    ]

    if not image_files:
        print("No images found in the input directory.")
        return

    print(f"Found {len(image_files)} images. Starting processing...")

    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        list(tqdm(executor.map(process_wrapper, image_files), total=len(image_files)))

    print("Processing completed.")

def process_wrapper(image_path):
    """Wrapper function to process each image."""
    filename = os.path.splitext(os.path.basename(image_path))[0] + '.webp'
    output_path = os.path.join(OUTPUT_FOLDER, filename)
    convert_to_webp(image_path, output_path, WEBP_QUALITY, MAX_DIMENSION)

if __name__ == "__main__":
    batch_convert_images()
