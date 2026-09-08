import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAllUsers } from '../../../features/projects/hooks/useAllUsers';
import { useAllContacts } from '../hooks/useAllContacts';
import { useAllGalleries } from '../hooks/useAllGalleries';
import { useAllDrillingRigs } from '../hooks/useDrillingRigs';
import { ActionForm } from './ActionForm';
import { apiClient } from '../../../libs';
import { Button, Input, Select, Label } from '../../../components/ui/';

import { toast } from 'sonner';
import { OperationsBottomPanel } from './OperationsBottomPanel';
import {
  CalendarDays,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  FileImage,
  FilePlus2,
  HardHat,
  Mail,
  MountainSnow,
  Send,
  Upload,
  Users,
  WalletCards,
  Wrench,
  Clock,
  Pin,
  FileText,
  LockOpen,
} from 'lucide-react';
import type { Gallery, GalleryPhoto } from '../../../features/projects/types';

interface OperationsPanelProps {
  projectId: number;
}
type RecordValue = Record<string, unknown>;

interface VisitConditions {
  cuttingsDisposal?: string | null;
  hasElectricity25a?: boolean;
  hasWaterConnection?: boolean;
}

interface SiteVisit {
  id: number;
  plannedAt?: string | null;
  location?: string | null;
  assignedUserFirstName?: string | null;
  assignedUserLastName?: string | null;
  hasProjectDocumentation?: boolean;
  conditions?: VisitConditions | null;
}

interface Retention {
  id: number;
  amount: string | number;
  retentionType?: string | null;
  releaseDate?: string | null;
  isReleased?: boolean;
}

const call = async <T,>(
  method: 'get' | 'post' | 'patch',
  url: string,
  data?: unknown,
  config?: Record<string, unknown>,
) => {
  const response = await apiClient.request<T>({ method, url, data, ...config });
  return response.data;
};

const useProjectQuery = <T,>(key: string, url: string, projectId: number) =>
  useQuery<T>({
    queryKey: ['projects', projectId, key],
    queryFn: () => call<T>('get', url),
    enabled: Number.isInteger(projectId),
  });

export const OperationsPanel = ({ projectId }: OperationsPanelProps) => {
  const queryClient = useQueryClient();

  const { data: projectContacts } = useQuery<RecordValue[]>({
    queryKey: ['projects', projectId, 'contacts'],
    queryFn: () => call<RecordValue[]>('get', `/projects/${projectId}/contacts/`),
  });
  console.log('projectContacts', projectContacts);
  const { data: allUsers } = useAllUsers();
  const { data: allContacts } = useAllContacts();
  const { data: allDrillingRigs } = useAllDrillingRigs();
  const { data: allGalleries } = useAllGalleries(String(projectId));

  const finance = useProjectQuery<RecordValue>(
    'finance',
    `/projects/${projectId}/finance-overview/`,
    projectId,
  );
  const report = useProjectQuery<RecordValue>(
    'technical-report',
    `/projects/${projectId}/technical-report/`,
    projectId,
  );
  const visits = useQuery<SiteVisit[]>({
    queryKey: ['site-visits', projectId],
    queryFn: () => call<SiteVisit[]>('get', `/site-visits/${projectId}`),
  });
  const schedules = useQuery<RecordValue[]>({
    queryKey: ['schedules', projectId],
    queryFn: () => call<RecordValue[]>('get', `/drilling-schedule/?project=${projectId}`),
  });
  const [visit, setVisit] = useState({
    assignedUser: '',
    plannedAt: '',
    location: '',
    hasProjectDocumentation: false,
  });
  const [schedule, setSchedule] = useState({
    drillingRig: '',
    startDate: '',
    endDate: '',
    isContracted: false,
  });
  const [reportForm, setReportForm] = useState({
    depthMeters: '',
    technicalSpecifications: '',
    driller: '',
    filledAt: '',
    alertDriller: true,
  });
  const [document, setDocument] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('JINE');
  const [gallery, setGallery] = useState({ name: '', galleryId: '', image: null as File | null });
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const selectedGallery = allGalleries?.find((item) => String(item.id) === gallery.galleryId);
  const navigatePhoto = (direction: 1 | -1) => {
    if (!lightboxPhoto || !selectedGallery || selectedGallery.photos.length < 2) return;

    const currentIndex = selectedGallery.photos.findIndex((photo) => photo.id === lightboxPhoto.id);
    const nextIndex = (currentIndex + direction + selectedGallery.photos.length) % selectedGallery.photos.length;
    setLightboxPhoto(selectedGallery.photos[nextIndex]);
  };
  const [invoice, setInvoice] = useState({
    invoiceNumber: '',
    amount: '',
    issueDate: '',
    dueDate: '',
  });
  const [protocol, setProtocol] = useState({ period: '', invoicedAmount: '' });
  const [contact, setContact] = useState({ contactId: '', contactType: '' });

  useEffect(() => {
    if (!lightboxPhoto) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxPhoto(null);
      if (event.key === 'ArrowLeft') navigatePhoto(-1);
      if (event.key === 'ArrowRight') navigatePhoto(1);
    };

    globalThis.document.addEventListener('keydown', closeOnEscape);
    return () => globalThis.document.removeEventListener('keydown', closeOnEscape);
  }, [lightboxPhoto, selectedGallery]);
  console.log(gallery);
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    queryClient.invalidateQueries({ queryKey: ['all-galleries', String(projectId)] });
  };
  const mutation = useMutation({
    mutationFn: ({
      method,
      url,
      data,
      config,
    }: {
      method: 'post' | 'patch';
      url: string;
      data?: unknown;
      config?: Record<string, unknown>;
    }) => call(method, url, data, config),
    onSuccess: invalidate,
  });
  const submit = (data: {
    method: 'post' | 'patch';
    url: string;
    data?: unknown;
    config?: Record<string, unknown>;
  }) =>
    toast.promise(mutation.mutateAsync(data), {
      loading: 'Ukládám...',
      success: 'Uloženo.',
      error: 'Operace se nepodařila.',
    });

  function submitVisit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit({
      method: 'post',
      url: '/site-visits/',
      data: {
        ...visit,
        assignedUser: visit.assignedUser,
        plannedAt: visit.plannedAt,
        order: projectId,
      },
    });
  }
  function submitSchedule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit({
      method: 'post',
      url: '/drilling-schedule/',
      data: {
        ...schedule,
        drillingRig: schedule.drillingRig,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        project: projectId,
      },
    });
  }
  function submitReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit({
      method: 'post',
      url: `/projects/${projectId}/technical-report/`,
      data: {
        depthMeters: reportForm.depthMeters,
        technicalSpecifications: reportForm.technicalSpecifications,
        driller: reportForm.driller,
        filledAt: reportForm.filledAt,
        alertDriller: reportForm.alertDriller,
      },
    });
  }
  function submitDocument(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!document) return;
    const data = new FormData();
    data.append('file', document);
    data.append('file_name', document.name);
    data.append('document_type', documentType);
    submit({
      method: 'post',
      url: `/projects/${projectId}/documents/`,
      data,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    });
  }
  function submitGallery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit({
      method: 'post',
      url: `/projects/${projectId}/galleries/`,
      data: { name: gallery.name },
    });
  }
  function submitPhoto(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!gallery.image || !gallery.galleryId) return;
    const data = new FormData();
    data.append('image', gallery.image);
    submit({
      method: 'post',
      url: `/galleries/${gallery.galleryId}/photos/`,
      data,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    });
  }
  function submitInvoice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit({
      method: 'post',
      url: `/projects/${projectId}/invoices/`,
      data: {
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.amount,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
      },
    });
  }
  function submitProtocol(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit({
      method: 'post',
      url: `/projects/${projectId}/inspection-protocols/`,
      data: { period: protocol.period, invoicedAmount: protocol.invoicedAmount },
    });
  }
  function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit({
      method: 'post',
      url: `/projects/${projectId}/assign-contact/`,
      data: { contactId: contact.contactId, contactType: contact.contactType },
    });
  }

  const summary = (finance.data?.summary as RecordValue | undefined) ?? {};
  const invoices = (finance.data?.invoices as RecordValue[] | undefined) ?? [];
  const protocols = (finance.data?.inspectionProtocols as RecordValue[] | undefined) ?? [];
  const retentions = (finance.data?.retentions as Retention[] | undefined) ?? [];
  const field = (value: unknown) => (value == null ? '-' : String(value));
  const contactTypeLabel = (value: unknown) => {
    const type = String(value ?? '');
    return type === 'INVESTOR' ? 'Investor' : type === 'STAVBYVEDOUCI' ? 'Stavbyvedoucí' : type;
  };
  const retentionTypeLabel = (value: unknown) => {
    const type = String(value ?? '');
    return type === 'PO_PREDANI_DILA'
      ? 'Po předání díla'
      : type === 'PO_UPLYNUTI_ZARUKY'
        ? 'Po uplynutí záruky'
        : type === 'ZARIZENI_STAVENISTE'
          ? 'Zařízení staveniště'
          : type || 'Neuvedený typ';
  };

  return (
    <section className='grid grid-cols-1 md:grid-cols-2 gap-2 pb-18 bg-slate-50/70 p-4'>
      <ActionForm
        className='grid grid-cols-2 gap-2'
        icon={<MountainSnow className='size-6 text-brand-secondary' />}
        title='Terénní návštěvy projektu'
        onSubmit={submitVisit}
        pending={mutation.isPending}
      >
        <div className='col-span-2 rounded-lg border border-slate-200 bg-white p-4'>
          <div className='flex items-center gap-2'>
            <CalendarDays className='size-6 text-brand-secondary' />
            <h4 className='font-semibold'>Naplánované návštěvy</h4>
          </div>
          {(visits.data ?? []).map((item) => (
            <div
              key={String(item.id)}
              className='border-b-2 pb-2 border-gray-500 mt-2 text-sm text-slate-600 flex justify-between items-start'
            >
              <div className='grid grid-cols-2 gap-2'>
                <span className='flex gap-2 items-center'>
                  <Clock size={18} />
                  {field(item.plannedAt)}
                </span>
                <span className='flex gap-2 items-center'>
                  <Pin size={18} />
                  {field(item.location)}
                </span>
                <span className='flex gap-2 items-center'>
                  <Users size={18} />
                  {field(item.assignedUserFirstName)} {field(item.assignedUserLastName)}
                </span>
                <span className='flex gap-2 items-center'>
                  <FileText size={18} />
                  {item.hasProjectDocumentation ? (
                    <span className='text-sm font-medium'>
                      Dokumentace <Check className='size-4 ml-1 text-green-500 inline' />{' '}
                    </span>
                  ) : (
                    <span className='text-sm font-medium'>
                      Bez dokumentace <X className='size-4 text-red-500 inline' />{' '}
                    </span>
                  )}
                </span>
              </div>
              <div className='flex flex-wrap items-center gap-2'>
                {item.conditions?.cuttingsDisposal && (
                  <span className='rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800'>
                    Likvidace vývrtku: {item.conditions.cuttingsDisposal}
                  </span>
                )}
                {item.conditions?.hasElectricity25a && (
                  <span className='rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800'>
                    Elektřina 25 A
                  </span>
                )}
                {item.conditions?.hasWaterConnection && (
                  <span className='rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800'>
                    Připojená voda
                  </span>
                )}
                {!item.conditions?.cuttingsDisposal &&
                  !item.conditions?.hasElectricity25a &&
                  !item.conditions?.hasWaterConnection && (
                    <span className='text-xs text-slate-400'>Bez uvedených podmínek</span>
                  )}
              </div>
            </div>
          ))}
          {!visits.data?.length && (
            <p className='mt-2 text-sm text-slate-500'>Zatím žádné návštěvy.</p>
          )}
        </div>
        <Select
          required
          value={visit.assignedUser}
          onChange={(e) => setVisit({ ...visit, assignedUser: e.target.value })}
        >
          <option value=''>Vyberte uživatele</option>
          {(allUsers ?? []).map((user) => (
            <option key={user.id} value={String(user.id)}>
              {user.firstName} {user.lastName} ({user.email})
            </option>
          ))}
        </Select>
        <Input
          required
          type='datetime-local'
          value={visit.plannedAt}
          onChange={(e) => setVisit({ ...visit, plannedAt: e.target.value })}
        />
        <Input
          required
          placeholder='Místo'
          value={visit.location}
          onChange={(e) => setVisit({ ...visit, location: e.target.value })}
        />

        <Label className='flex items-center gap-2 text-sm'>
          <input
            type='checkbox'
            checked={visit.hasProjectDocumentation}
            onChange={(e) => setVisit({ ...visit, hasProjectDocumentation: e.target.checked })}
          />{' '}
          Má projektovou dokumentaci
        </Label>
      </ActionForm>
      <ActionForm
        icon={<Users className='size-6 text-brand-secondary' />}
        className='grid grid-cols-2 gap-2'
        title='Kontakty'
        onSubmit={submitContact}
        pending={mutation.isPending}
      >
        <div className='col-span-2 rounded-lg border border-slate-200 bg-white p-4'>
          <div className='flex items-center gap-2'>
            <Users className='size-6 text-brand-secondary' />
            <h4 className='font-semibold'>Přiřazené kontakty</h4>
          </div>
          {(projectContacts ?? []).length > 0 ? (
            <div className='mt-3 space-y-3'>
              {(projectContacts ?? []).map((contact) => (
                <div
                  key={String(contact.id ?? contact.email ?? 'contact')}
                  className='rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600'
                >
                  <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
                    <span className='flex items-center gap-2 font-medium text-slate-800'>
                      <Mail className='size-4 text-brand-secondary' />
                      {field(contact.email)}
                    </span>
                    {Boolean(contact.company) && (
                      <span className='flex items-center gap-2'>
                        <Building2 className='size-4 text-slate-400' />
                        {field(contact.company)}
                      </span>
                    )}
                    {Boolean(contact.contactType) && (
                      <span className='rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800'>
                        {contactTypeLabel(contact.contactType)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='mt-3 text-sm text-slate-500'>Zatím nejsou přiřazeny žádné kontakty.</p>
          )}
        </div>
        <Select
          required
          value={contact.contactId}
          onChange={(e) => setContact({ ...contact, contactId: e.target.value })}
        >
          <option value=''>Vyberte kontakt</option>
          {(allContacts ?? []).map((contact) => (
            <option key={contact.id} value={String(contact.id)}>
              {contact.firstName} {contact.lastName} ({contact.email}) {contact.company ?? ''}
            </option>
          ))}
        </Select>
        <Select
          required
          value={contact.contactType}
          onChange={(e) => setContact({ ...contact, contactType: e.target.value })}
        >
          <option value=''>Vyberte typ kontaktu</option>
          <option value='INVESTOR'>Investor</option>
          <option value='STAVBYVEDOUCI'>Stavbyvedoucí</option>
        </Select>
      </ActionForm>

      <ActionForm
        className='grid grid-cols-2 gap-2'
        icon={<Wrench className='size-6 text-brand-secondary' />}
        title='Termíny projektu a harmonogram vrtání'
        onSubmit={submitSchedule}
        pending={mutation.isPending}
      >
        <div className='col-span-2 rounded-lg border border-slate-200 bg-white p-4'>
          <div className='flex items-center gap-2'>
            <HardHat className='size-6 text-brand-secondary' />
            <h4 className='font-semibold'>Naplánované termíny</h4>
          </div>
          {(schedules.data ?? []).map((item) => (
            <p key={String(item.id)} className='mt-2 text-sm text-slate-600'>
              {field(item.startDate)} až {field(item.endDate)} · souprava {field(item.drillingRig)}{' '}
              · {item.isContracted ? <b>Smluvně potvrzený</b> : 'Nezávazný'}
            </p>
          ))}
          {!schedules.data?.length && (
            <p className='mt-2 text-sm text-slate-500'>Zatím není naplánovaný termín.</p>
          )}
        </div>
        <Select
          required
          value={schedule.drillingRig}
          onChange={(e) => setSchedule({ ...schedule, drillingRig: e.target.value })}
        >
          <option value=''>Vyberte soupravu</option>
          {(allDrillingRigs ?? []).map((rig) => (
            <option key={rig.id} value={String(rig.id)}>
              {rig.name} ({rig.registration})
            </option>
          ))}
        </Select>
        <Input
          required
          type='date'
          value={schedule.startDate}
          onChange={(e) => setSchedule({ ...schedule, startDate: e.target.value })}
        />
        <Input
          required
          type='date'
          value={schedule.endDate}
          onChange={(e) => setSchedule({ ...schedule, endDate: e.target.value })}
        />

        <Label className='flex items-center gap-2 text-sm'>
          <input
            type='checkbox'
            checked={schedule.isContracted}
            onChange={(e) => setSchedule({ ...schedule, isContracted: e.target.checked })}
          />{' '}
          Smluvně potvrzený termín
        </Label>
      </ActionForm>
      <ActionForm
        icon={<FilePlus2 className='size-6 text-brand-secondary' />}
        className='grid grid-cols-2 gap-2'
        title='Technická zpráva'
        onSubmit={submitReport}
        pending={mutation.isPending}
      >
        {report.data && (
          <div className='col-span-2 rounded-lg border border-slate-200 bg-white p-4'>
          <p className='text-sm text-slate-600 col-span-2'>
            Poslední zpráva: {field(report.data.depthMeters)} m · {field(report.data.filledAt)}
          </p>
          <p>
            {field(report.data.technicalSpecifications)}
          </p>
          </div>
        )}
        <Select
          required
          value={reportForm.driller}
          onChange={(e) => setReportForm({ ...reportForm, driller: e.target.value })}
        >
          <option value=''>Vyberte vrtmistra</option>
          {(allUsers ?? []).map((user) => (
            <option key={user.id} value={String(user.id)}>
              {user.firstName} {user.lastName} ({user.email})
            </option>
          ))}
        </Select>
        <Input
          required
          type='datetime-local'
          value={reportForm.filledAt}
          onChange={(e) => setReportForm({ ...reportForm, filledAt: e.target.value })}
        />
        <Input
          required
          type='number'
          step='0.01'
          placeholder='Hloubka v metrech'
          value={reportForm.depthMeters}
          onChange={(e) => setReportForm({ ...reportForm, depthMeters: e.target.value })}
        />
        <Input
          required
          placeholder='Technické specifikace'
          value={reportForm.technicalSpecifications}
          onChange={(e) =>
            setReportForm({ ...reportForm, technicalSpecifications: e.target.value })
          }
        />

        <Label className='flex items-center gap-2 text-sm'>
          <input
            type='checkbox'
            checked={reportForm.alertDriller}
            onChange={(e) => setReportForm({ ...reportForm, alertDriller: e.target.checked })}
          />{' '}
          Upozorňovat vrtmistra
        </Label>
      </ActionForm>

      <ActionForm
        icon={<Upload className='size-6 text-brand-secondary' />}
        className='grid grid-cols-2 gap-2'
        title='Dokumenty'
        onSubmit={submitDocument}
        pending={mutation.isPending}
      >
        <Select
          className='col-span-2'
          required
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
        >
          <option value='POVOLENI_Z_URADU'>Povolení z úřadu</option>
          <option value='PROJEKTOVA_DOKUMENTACE'>Projektová dokumentace</option>
          <option value='SMLOUVA'>Smlouva</option>
          <option value='JINE'>Ostatní dokumentace</option>
        </Select>
        <Label
          htmlFor='project-document-upload'
          className='col-span-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600 transition hover:border-brand-secondary hover:bg-slate-50'
        >
          <Upload className='size-8 text-brand-secondary' />
          <span className='font-medium'>
            {document ? document.name : 'Klikněte pro nahrání dokumentu'}
          </span>
          <span className='text-xs text-slate-400'>Vyberte soubor z počítače</span>
          <input
            id='project-document-upload'
            required
            type='file'
            className='sr-only'
            onChange={(e) => setDocument(e.target.files?.[0] ?? null)}
          />
        </Label>
      </ActionForm>

      <ActionForm
        className='grid grid-cols-2 gap-2'
        icon={<FileImage className='size-6 text-brand-secondary' />}
        title='Nová galerie'
        onSubmit={submitGallery}
        pending={mutation.isPending}
      >
        <Input
          required
          placeholder='Název galerie'
          className='col-span-2'
          value={gallery.name}
          onChange={(e) => setGallery({ ...gallery, name: e.target.value })}
        />
      </ActionForm>
      <ActionForm
        className='grid grid-cols-2 col-span-2 gap-2'
        icon={<FileImage className='size-6 text-brand-secondary' />}
        title='Fotogalerie'
        onSubmit={submitPhoto}
        pending={mutation.isPending}
      >
        <Select
          className='col-span-2'
          required
          value={gallery.galleryId}
          onChange={(e) => setGallery({ ...gallery, galleryId: e.target.value })}
        >
          <option value=''>Vyberte galerii</option>
          {(allGalleries ?? []).map((gallery: Gallery) => (
            <option key={gallery.id} value={String(gallery.id)}>
              {gallery.name}
            </option>
          ))}
        </Select>

        {selectedGallery && (
          <div className='col-span-2 rounded-lg border border-slate-200 bg-white p-3'>
            <p className='mb-2 text-sm font-medium text-slate-700'>
              Fotografie v galerii ({selectedGallery.photos.length})
            </p>
            {selectedGallery.photos.length > 0 ? (
              <div className='flex flex-wrap items-center gap-2'>
                {selectedGallery.photos.map((photo) => (
                  <button
                    key={photo.id}
                    type='button'
                    className='relative border-2 border-gray-500 h-24 w-24 overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary'
                    onClick={() => setLightboxPhoto(photo)}
                    aria-label={`Zobrazit fotografii ${photo.id}`}
                  >
                    <img
                      src={photo.image}
                      alt={`Fotografie ${photo.id}`}
                      className='h-full w-full object-cover'
                    />
                  </button>
                ))}
              </div>
            ) : (
              <p className='text-sm text-slate-500'>Galerie zatím neobsahuje žádné fotografie.</p>
            )}
          </div>
        )}

        <Label
          htmlFor='gallery-photo-upload'
          className='col-span-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600 transition hover:border-brand-secondary hover:bg-slate-50'
        >
          <Upload className='size-8 text-brand-secondary' />
          <span className='font-medium'>
            {gallery.image ? gallery.image.name : 'Klikněte pro nahrání fotografie'}
          </span>
          <span className='text-xs text-slate-400'>Pouze obrázky</span>
          <input
            id='gallery-photo-upload'
            required
            type='file'
            accept='image/*'
            className='sr-only'
            multiple={true}
            onChange={(e) => setGallery({ ...gallery, image: e.target.files?.[0] ?? null })}
          />
        </Label>

        {lightboxPhoto && (
          <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4'
            role='dialog'
            aria-modal='true'
            aria-label='Náhled fotografie'
            onClick={() => setLightboxPhoto(null)}
          >
            <div
              className='relative max-h-full max-w-5xl'
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={lightboxPhoto.image}
                alt={`Fotografie ${lightboxPhoto.id}`}
                className='max-h-[85vh] max-w-full rounded object-contain'
              />
              {selectedGallery && selectedGallery.photos.length > 1 && (
                <>
                  <button
                    type='button'
                    className='absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-content-center rounded-full bg-black/70 text-white hover:bg-black'
                    onClick={() => navigatePhoto(-1)}
                    aria-label='Předchozí fotografie'
                  >
                    <ChevronLeft className='size-6' />
                  </button>
                  <button
                    type='button'
                    className='absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-content-center rounded-full bg-black/70 text-white hover:bg-black'
                    onClick={() => navigatePhoto(1)}
                    aria-label='Další fotografie'
                  >
                    <ChevronRight className='size-6' />
                  </button>
                </>
              )}
              <button
                type='button'
                className='absolute right-2 top-2 rounded-full bg-black/70 w-6 h-6 grid place-content-center p-1 text-xl leading-none text-white hover:bg-black'
                onClick={() => setLightboxPhoto(null)}
                aria-label='Zavřít náhled fotografie'
              >
                ×
              </button>
            </div>
          </div>
        )}
      </ActionForm>

      <ActionForm
        icon={<WalletCards className='size-6 text-brand-secondary' />}
        className='grid grid-cols-2 gap-2'
        title='Fakturace'
        onSubmit={submitInvoice}
        pending={mutation.isPending}
      >
        <div className='rounded-lg border border-slate-200 bg-white p-4 text-sm col-span-2'>
          <p className='font-semibold'>Finance</p>
          <p className='mt-2'>
            Fakturace: {field(summary.invoiced)} · Uhrazeno: {field(summary.totalPaid)} · Zbývá:{' '}
            {field(summary.remaining)}
          </p>
          <p className='mt-2 text-slate-500'>
            {invoices.length} faktur · {protocols.length} protokolů · {retentions.length} pozastávek
          </p>
        </div>
        <Input
          required
          placeholder='Číslo faktury'
          value={invoice.invoiceNumber}
          onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
        />
        <Input
          required
          type='number'
          step='0.01'
          placeholder='Částka'
          value={invoice.amount}
          onChange={(e) => setInvoice({ ...invoice, amount: e.target.value })}
        />
        <Label className='flex flex-col gap-1 text-sm font-semibold items-baseline'>
          Datum vystavení a splatnosti
          <Input
            required
            type='date'
            placeholder='Datum vystavení'
            value={invoice.issueDate}
            onChange={(e) => setInvoice({ ...invoice, issueDate: e.target.value })}
          />
        </Label>
        <Label className='flex flex-col gap-1 text-sm font-semibold items-baseline'>
          Datum splatnosti
          <Input
            required
            placeholder='Datum splatnosti'
            type='date'
            value={invoice.dueDate}
            onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
          />
        </Label>
      </ActionForm>

      <ActionForm
        icon={<WalletCards className='size-6 text-brand-secondary' />}
        className='grid grid-cols-2 gap-2'
        title='Nový zjišťovací protokol'
        onSubmit={submitProtocol}
        pending={mutation.isPending}
      >
        <div className='col-span-2 rounded-lg border border-slate-200 bg-white p-4'>
          <div className='flex items-center gap-2'>
            <FileText className='size-5 text-brand-secondary' />
            <h4 className='font-semibold'>Existující protokoly</h4>
          </div>
          {protocols.length > 0 ? (
            <div className='mt-3 space-y-2'>
              {protocols.map((item) => (
                <div
                  key={String(item.id)}
                  className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3'
                >
                  <div className='text-sm text-slate-700'>
                    <span className='font-medium'>Období: {field(item.period)}</span>
                    <span className='ml-3 text-slate-500'>
                      Fakturováno: {field(item.invoicedAmount)} Kč
                    </span>
                  </div>
                  <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    onClick={() =>
                      submit({ method: 'post', url: `/inspection-protocols/${item.id}/send/` })
                    }
                  >
                    <Send className='size-4' /> Odeslat
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className='mt-3 text-sm text-slate-500'>Zatím nejsou vytvořené žádné protokoly.</p>
          )}
        </div>
        <Label>
          Období
          <Input
            required
            type='month'
            placeholder='Období RRRR-MM'
            lang='cs'
            value={protocol.period}
            onChange={(e) => setProtocol({ ...protocol, period: e.target.value })}
          />
        </Label>
        <Input
          required
          type='number'
          step='0.01'
          placeholder='Fakturovaná částka'
          value={protocol.invoicedAmount}
          onChange={(e) => setProtocol({ ...protocol, invoicedAmount: e.target.value })}
        />
      </ActionForm>
      <OperationsBottomPanel>
        {retentions.map(
          (item) =>
            !item.isReleased && (
              <Button
                key={String(item.id)}
                type='button'
                size='sm'
                variant='outline'
                onClick={() => submit({ method: 'patch', url: `/retentions/${item.id}/release/` })}
              >
                <LockOpen className='size-4' /> Uvolnit pozastávku:{' '}
                {retentionTypeLabel(item.retentionType)} - {field(item.amount)} Kč
              </Button>
            ),
        )}
      </OperationsBottomPanel>
    </section>
  );
};
