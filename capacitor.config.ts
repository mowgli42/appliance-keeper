import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.mowgli42.appliancekeeper',
	appName: 'Appliance Keeper',
	webDir: 'build',
	server: {
		androidScheme: 'https'
	}
};

export default config;
