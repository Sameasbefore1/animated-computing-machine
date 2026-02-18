from PIL import Image, ImageDraw
import os

def create_icon(size, filename):
    """Create a simple icon with a circle and checkmark"""
    # Create image with white background
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw a green circle
    draw.ellipse([(2, 2), (size-2, size-2)], fill=(76, 175, 80, 255), outline=(50, 120, 55, 255), width=2)
    
    # Draw a white checkmark
    # Simple approach: draw a few pixels for the checkmark
    if size >= 16:
        # Draw checkmark with anti-aliasing effect by drawing multiple points
        points = [
            (size//3, size//2),
            (size//3 + 2, size//2),
            (size//3 + 4, size//2),
            (size//2 - 2, size//2 + 2),
            (size//2, size//2 + 4),
            (size//2 + 2, size//2 + 6),
            (size//2 + 4, size//2 + 8),
        ]
        
        for x, y in points:
            # Ensure we're within bounds
            x = max(2, min(size-3, x))
            y = max(2, min(size-3, y))
            draw.point((x, y), fill=(255, 255, 255, 255))
    
    img.save(filename)

# Create the icon files
create_icon(16, '/workspace/qwen-cookie-cleaner/icon16.png')
create_icon(48, '/workspace/qwen-cookie-cleaner/icon48.png')
create_icon(128, '/workspace/qwen-cookie-cleaner/icon128.png')

print("Icons generated successfully!")