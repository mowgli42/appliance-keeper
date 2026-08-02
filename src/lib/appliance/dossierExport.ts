import { nextFilterDueAt } from './attentionRules';
import { kindLabels, roomLabels } from './labels';
import { lookupManufacturerContact } from './manufacturerContacts';
import { mediaForAppliance } from './mediaRules';
import { usefulLifeHint } from './usefulLife';
import type {
	Appliance,
	FilterSchedule,
	HouseholdState,
	MediaAttachment,
	ServiceRecord,
	Warranty
} from '$lib/types/appliance';

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

function applianceBlock(
	appliance: Appliance,
	filters: FilterSchedule[],
	warranties: Warranty[],
	services: ServiceRecord[],
	media: MediaAttachment[],
	asOfIso: string
): string {
	const hint = usefulLifeHint(appliance, asOfIso);
	const contact = lookupManufacturerContact(appliance.brand);
	const photos = mediaForAppliance(media, appliance.id).filter((m) =>
		m.mimeType.startsWith('image/')
	);
	const filterLines = filters
		.map((f) => {
			const buy = f.purchaseUrl ? ` · <a href="${escapeHtml(f.purchaseUrl)}">Reorder</a>` : '';
			return `<li>${escapeHtml(f.label)} — due ${escapeHtml(nextFilterDueAt(f))}${
				f.partHint ? ` (${escapeHtml(f.partHint)})` : ''
			}${buy}</li>`;
		})
		.join('');
	const warrantyLines = warranties
		.map(
			(w) =>
				`<li>${escapeHtml(w.label)} — ends ${escapeHtml(w.endsAt)}${
					w.provider ? ` · ${escapeHtml(w.provider)}` : ''
				}</li>`
		)
		.join('');
	const serviceLines = services
		.map(
			(s) =>
				`<li>${escapeHtml(s.title)} — ${escapeHtml(s.performedAt)}${
					s.nextDueAt ? ` · next ${escapeHtml(s.nextDueAt)}` : ''
				}</li>`
		)
		.join('');
	const photoHtml = photos
		.slice(0, 3)
		.map(
			(p) =>
				`<figure><img src="${p.dataUrl}" alt="${escapeHtml(p.label)}" /><figcaption>${escapeHtml(
					p.label
				)}</figcaption></figure>`
		)
		.join('');

	return `
	<section class="appliance">
		<h2>${escapeHtml(appliance.name)}</h2>
		<p class="meta">${escapeHtml(kindLabels[appliance.kind])} · ${escapeHtml(roomLabels[appliance.room])}</p>
		<ul>
			${appliance.brand ? `<li>Brand: ${escapeHtml(appliance.brand)}</li>` : ''}
			${appliance.model ? `<li>Model: ${escapeHtml(appliance.model)}</li>` : ''}
			${appliance.serialNumber ? `<li>Serial: ${escapeHtml(appliance.serialNumber)}</li>` : ''}
			${appliance.purchasedAt ? `<li>Purchased: ${escapeHtml(appliance.purchasedAt)}</li>` : ''}
		</ul>
		<p><strong>Useful life:</strong> ${escapeHtml(hint.summary)}</p>
		${
			contact.found
				? `<p><strong>Support:</strong> ${escapeHtml(contact.contact.brand)}${
						contact.contact.phone ? ` · ${escapeHtml(contact.contact.phone)}` : ''
					}${
						contact.contact.supportUrl
							? ` · <a href="${escapeHtml(contact.contact.supportUrl)}">Website</a>`
							: ''
					}</p>`
				: `<p><strong>Support:</strong> ${escapeHtml(contact.searchHint)}</p>`
		}
		<h3>Filters</h3>
		${filterLines ? `<ul>${filterLines}</ul>` : '<p>None on file.</p>'}
		<h3>Warranties</h3>
		${warrantyLines ? `<ul>${warrantyLines}</ul>` : '<p>None on file.</p>'}
		<h3>Service</h3>
		${serviceLines ? `<ul>${serviceLines}</ul>` : '<p>None on file.</p>'}
		${photoHtml ? `<h3>Photos</h3><div class="photos">${photoHtml}</div>` : ''}
	</section>`;
}

function wrapDocument(title: string, body: string, exportedAt: string): string {
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: Georgia, serif; color: #1a2a27; margin: 2rem; line-height: 1.45; }
  h1, h2, h3 { font-family: system-ui, sans-serif; }
  .footer { margin-top: 2rem; font-size: 0.9rem; color: #4a5f5a; }
  .photos { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .photos img { max-width: 180px; max-height: 140px; object-fit: cover; border: 1px solid #ccc; }
  @media print { body { margin: 0.5in; } }
</style>
</head>
<body>
<h1>${escapeHtml(title)}</h1>
<p>Exported ${escapeHtml(exportedAt)}</p>
${body}
<p class="footer">Appliance Keeper — data is local-only on this device. Not uploaded automatically.</p>
</body>
</html>`;
}

export function buildApplianceDossierHtml(
	state: HouseholdState,
	applianceId: string,
	asOfIso: string
): string {
	const appliance = state.appliances.find((a) => a.id === applianceId);
	if (!appliance) throw new Error(`Unknown appliance: ${applianceId}`);
	const body = applianceBlock(
		appliance,
		state.filters.filter((f) => f.applianceId === applianceId),
		state.warranties.filter((w) => w.applianceId === applianceId),
		state.services.filter((s) => s.applianceId === applianceId),
		state.media,
		asOfIso
	);
	return wrapDocument(`${appliance.name} dossier`, body, asOfIso);
}

export function buildHouseholdDossierHtml(state: HouseholdState, asOfIso: string): string {
	const blocks = [...state.appliances]
		.sort((a, b) => a.name.localeCompare(b.name))
		.map((appliance) =>
			applianceBlock(
				appliance,
				state.filters.filter((f) => f.applianceId === appliance.id),
				state.warranties.filter((w) => w.applianceId === appliance.id),
				state.services.filter((s) => s.applianceId === appliance.id),
				state.media,
				asOfIso
			)
		)
		.join('\n');
	return wrapDocument('Household appliance summary', blocks, asOfIso);
}

export function openPrintableDossier(html: string) {
	const blob = new Blob([html], { type: 'text/html' });
	const url = URL.createObjectURL(blob);
	const win = window.open(url, '_blank', 'noopener,noreferrer');
	if (!win) {
		URL.revokeObjectURL(url);
		throw new Error('Pop-up blocked — allow pop-ups to print or save as PDF');
	}
	win.addEventListener('load', () => {
		win.focus();
		win.print();
		URL.revokeObjectURL(url);
	});
}
