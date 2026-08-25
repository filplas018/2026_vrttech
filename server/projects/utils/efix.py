from PIL import Image, ExifTags


def extract_gps_coordinates(image_file):
    """
    Vytáhne GPS zeměpisnou šířku (latitude) a délku (longitude) z EXIF dat obrázku.
    Vrací tuple (latitude, longitude) jako float, nebo (None, None).
    """
    try:
        image = Image.open(image_file)
        exif_data = image._getexif()

        if not exif_data:
            return None, None

        gps_info = {}
        for tag_id, value in exif_data.items():
            tag_name = ExifTags.TAGS.get(tag_id, tag_id)
            if tag_name == 'GPSInfo':
                for gps_tag_id in value:
                    sub_tag = ExifTags.GPSTAGS.get(gps_tag_id, gps_tag_id)
                    gps_info[sub_tag] = value[gps_tag_id]

        lat = _convert_to_degrees(gps_info.get('GPSLatitude'), gps_info.get('GPSLatitudeRef'))
        lon = _convert_to_degrees(gps_info.get('GPSLongitude'), gps_info.get('GPSLongitudeRef'))

        return lat, lon

    except Exception:
        return None, None
    finally:
        # Vracíme ukazatel v souboru na začátek pro korektní uložení přes Django ORM
        if hasattr(image_file, 'seek'):
            image_file.seek(0)


def _convert_to_degrees(value, ref):
    if not value or not ref:
        return None

    d, m, s = [float(x) for x in value]
    degrees = d + (m / 60.0) + (s / 3600.0)

    if ref in ['S', 'W']:
        degrees = -degrees

    return round(degrees, 7)