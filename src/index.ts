import './config'
import { bot, Context } from './http';

type APOD = {
	hdurl: string;
	url: string;
	title: string;
	copyright: string;
	date: string;
};

const cache = new Map();

const APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`;

const fetchApod = async (ctx: Context) => {
	try {
		if (cache.has('apod')) {
			const { hdurl, url, title, copyright, date }: APOD = cache.get('apod');

			console.log(`\nCache size: ${cache.size}`)

			if (!url) throw new Error('Invalid image');

			return ctx.sendPhoto(hdurl || url, {
				caption: `${title} - ${date} \n\nCopyright: ${copyright ? `${copyright}` : ''}`,
			});
		}

		console.log('FETCHING IMAGE...')

		const response = await fetch(APOD_URL);

		const data = await response.json();

		if (!data) {
			throw new Error('Could not fetch image');
		}

		const { hdurl, url, title, copyright, date }: APOD = data;

		cache.set('apod', data);

		if (!url) throw new Error('Invalid image');

		ctx.sendPhoto(hdurl || url, {
			caption: `${title} - ${date} \n\nCopyright: ${copyright ? `${copyright}` : ''}`,
		});

	} catch (error) {
		console.error(error);
		return ctx.reply('Could not fetch image');
	}
}

const helpMsg = `Command reference:
/help - Show this message
/apod - NASA's Astronomy Picture of the Day
`;

bot.command('help', async (ctx) => {
	await ctx.telegram.sendMessage(ctx.chat.id, helpMsg);
});

bot.command('apod', fetchApod);

bot.launch().catch(console.log);
