import os
import struct
import zlib
import math

def create_png(width, height, filename):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    # We will draw a gradient background with cricket ball/bat aesthetic
    raw_data = bytearray()
    
    cx, cy = width / 2, height / 2
    r_outer = width * 0.44
    r_inner = width * 0.38

    for y in range(height):
        # Filter byte 0 (None)
        raw_data.append(0)
        for x in range(width):
            dx = x - cx
            dy = y - cy
            dist = math.sqrt(dx*dx + dy*dy)
            
            # Rounded app icon corner mask
            # Emerald & Cyan Gradient
            t = (x + y) / (width + height)
            
            # Base dark stadium background
            r = int(10 + t * 6)
            g = int(15 + t * 15)
            b = int(26 + t * 20)
            a = 255
            
            # Circular badge in center
            if dist <= r_outer:
                # Border ring
                if dist >= r_inner:
                    # Gold border ring
                    r = 245
                    g = 158
                    b = 11
                else:
                    # Inside circle: emerald turf green gradient
                    r = int(16 + (y / height) * 20)
                    g = int(185 - (y / height) * 40)
                    b = int(129 - (y / height) * 40)
                    
                    # Cricket seam line across
                    seam_dist = abs(dx - dy * 0.5)
                    if seam_dist < width * 0.035:
                        r = 255
                        g = 255
                        b = 255

            raw_data.extend([r, g, b, a])

    # PNG chunks
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw_data), 9)

    with open(filename, 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n')
        f.write(chunk(b'IHDR', ihdr))
        f.write(chunk(b'IDAT', idat))
        f.write(chunk(b'IEND', b''))

create_png(192, 192, 'c:/Users/darmu/Desktop/SCORE BOARD/icons/icon-192.png')
create_png(512, 512, 'c:/Users/darmu/Desktop/SCORE BOARD/icons/icon-512.png')
print("Icons successfully created.")
