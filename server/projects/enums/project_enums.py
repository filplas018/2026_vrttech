from django.db import models

class ProjectType(models.TextChoices):
    GEOTERMAL = 'GEOTERMALNI', 'Geotermální vrt'
    WELL = 'VRTANA_STUDNA', 'Vrtaná studna'
    BOTH = 'OBOJI', 'Geotermální vrt i studna'

class ProjectStatus(models.TextChoices):
    POPTAVKA = 'POPTAVKA', 'Poptávka (čeká se na cenovou nabídku)'
    REALIZACE = 'REALIZACE', 'Realizace (nájezd techniky)'
    HYDRO_POSOUZENI = 'HYDRO_POSOUZENI', 'Získávání dat od hydrogeologa'
    PREDANO = 'PREDANO', 'Předáno investorovi'

class CustomerInterest(models.TextChoices):
    CEKA_SE = 'CEKA_SE', 'Čeká se na vyjádření'
    MAM_ZAJEM = 'MAM_ZAJEM', 'Mám zájem'
    NEMAM_ZAJEM = 'NEMAM_ZAJEM', 'Nemám zájem'

class ContactType(models.TextChoices):
    INVESTOR = 'INVESTOR', 'Investor'
    FOREMAN = 'STAVBYVEDOUCI', 'Stavbyvedoucí'

class CuttingsDisposal(models.TextChoices):
    ON_SITE = 'V_MISTE', 'Likvidace v místě'
    CONTAINER = 'ODVOZ_KONTEJNEREM', 'Odvoz kontejnerem'

class WorkflowStepStatus(models.TextChoices):
    NOT_STARTED = 'NEZAHAJENO', 'Nezahájeno'
    IN_PROGRESS = 'PROBIHA', 'Probíhá'
    DONE = 'SPLNENO', 'Splněno'

class DocumentType(models.TextChoices):
    PERMIT = 'POVOLENI_Z_URADU', 'Povolení z úřadu'
    PROJECT_DOC = 'PROJEKTOVA_DOKUMENTACE', 'Projektová dokumentace'
    CONTRACT = 'SMLOUVA', 'Smlouva'
    OTHER = 'JINE', 'Ostatní dokumentace'

class RetentionType(models.TextChoices):
    POST_DELIVERY = 'PO_PREDANI_DILA', 'Po předání díla'
    POST_WARRANTY = 'PO_UPLYNUTI_ZARUKY', 'Po uplynutí záruky'
    SITE_SETUP = 'ZARIZENI_STAVENISTE', 'Zařízení staveniště'