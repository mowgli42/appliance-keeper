import type { MediaAttachment, MediaKind } from '$lib/types/appliance';
import { newId } from './labels';

export function createMediaAttachment(input: {
	applianceId: string;
	kind: MediaKind;
	label: string;
	mimeType: string;
	dataUrl: string;
	capturedAt: string;
}): MediaAttachment {
	if (!input.dataUrl) throw new Error('Media data is required');
	return {
		id: newId('media'),
		applianceId: input.applianceId,
		kind: input.kind,
		label: input.label.trim() || input.kind,
		mimeType: input.mimeType || 'application/octet-stream',
		dataUrl: input.dataUrl,
		capturedAt: input.capturedAt.slice(0, 10)
	};
}

export function mediaForAppliance(
	media: MediaAttachment[],
	applianceId: string
): MediaAttachment[] {
	return media
		.filter((m) => m.applianceId === applianceId)
		.sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));
}

export function removeMediaItem(
	media: MediaAttachment[],
	mediaId: string
): MediaAttachment[] {
	return media.filter((m) => m.id !== mediaId);
}

/** Read a File into a data URL (web / Capacitor file picker). */
export function readFileAsDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === 'string') resolve(reader.result);
			else reject(new Error('Could not read file'));
		};
		reader.onerror = () => reject(reader.error ?? new Error('File read failed'));
		reader.readAsDataURL(file);
	});
}
