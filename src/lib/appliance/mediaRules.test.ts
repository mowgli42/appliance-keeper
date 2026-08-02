import { describe, expect, it } from 'vitest';
import { createMediaAttachment, mediaForAppliance, removeMediaItem } from './mediaRules';

describe('mediaRules', () => {
	it('creates and filters media for an appliance', () => {
		const media = createMediaAttachment({
			applianceId: 'app-fridge',
			kind: 'nameplate',
			label: 'plate.jpg',
			mimeType: 'image/jpeg',
			dataUrl: 'data:image/jpeg;base64,xx',
			capturedAt: '2026-08-01'
		});
		expect(media.kind).toBe('nameplate');
		expect(mediaForAppliance([media], 'app-fridge')).toHaveLength(1);
	});

	it('removes a media item by id', () => {
		const media = createMediaAttachment({
			applianceId: 'app-fridge',
			kind: 'receipt',
			label: 'receipt.pdf',
			mimeType: 'application/pdf',
			dataUrl: 'data:application/pdf;base64,xx',
			capturedAt: '2026-08-01'
		});
		expect(removeMediaItem([media], media.id)).toEqual([]);
	});
});
