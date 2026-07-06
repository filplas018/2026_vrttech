import os

# Definice struktury: podadresář -> seznam souborů (bez přípony .py)
structure = {
    "projects": ["list_projects", "create_project", "get_project", "update_project", "assign_contact"],
    "visits": ["list_my_visits", "create_visit", "get_conditions", "create_conditions"],
    "drilling": ["list_rigs", "list_schedule", "create_schedule", "update_schedule", "create_technical_report", "get_technical_report", "get_well_workflow", "update_well_workflow_step"],
    "documents": ["upload_document", "list_documents", "create_gallery", "upload_photo"],
    "finance": ["get_finance_overview", "create_invoice", "update_invoice_status", "create_protocol", "sign_protocol", "send_protocol", "release_retention"]
}

# Cesta k tvé views složce (uprav název aplikace, pokud se nejmenuje 'projects')
BASE_DIR = os.path.join("projects", "views")

def camel_case(app_name):
    """Převede název souboru (snake_case) na název třídy (PascalCase) + APIView"""
    return "".join(word.capitalize() for word in app_name.split("_")) + "APIView"

def get_http_method(file_name):
    """Určí výchozí metodu podle klíčových slov v názvu souboru"""
    if any(keyword in file_name for keyword in ["create", "assign", "sign", "send", "upload"]):
        return "post"
    elif any(keyword in file_name for keyword in ["update", "release"]):
        return "patch"
    return "get"

def generate():
    # 1. Vytvoření hlavní složky views a jejího __init__.py
    os.makedirs(BASE_DIR, exist_ok=True)
    with open(os.path.join(BASE_DIR, "__init__.py"), "w", encoding="utf-8") as f:
        f.write("# Balíček views\n")

    # 2. Procházení struktury a generování podadresářů a souborů
    for folder, files in structure.items():
        folder_path = os.path.join(BASE_DIR, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        # Vytvoření __init__.py v podadresáři
        with open(os.path.join(folder_path, "__init__.py"), "w", encoding="utf-8") as f:
            f.write(f"# Views pro sub-modul {folder}\n")
            
        # Vytvoření jednotlivých endpoint souborů
        for file in files:
            file_path = os.path.join(folder_path, f"{file}.py")
            class_name = camel_case(file)
            method = get_http_method(file)
            
            # Šablona kódu pro každý soubor
            template = (
                "from rest_framework.views import APIView\n"
                "from rest_framework.response import Response\n"
                "from rest_framework import status\n\n"
                f"class {class_name}(APIView):\n"
                f"    def {method}(self, request, *args, **kwargs):\n"
                f"        return Response({{'message': '{class_name} ještě není naimplementován.'}}, status=status.HTTP_501_NOT_IMPLEMENTED)\n"
            )
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(template)
                
        print(f"✔ Složka views/{folder}/ vygenerována s {len(files)} soubory.")

if __name__ == "__main__":
    generate()
    print("\nVšechny soubory byly úspěšně hromadně vytvořeny!")