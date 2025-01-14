import Image from 'next/image';
import Carousel from './_components/carousel';

const mockData = [
	{
		id: '1',
		model: 'EX40',
		moto: 'All-electric SUV',
		description: 'Recommended price 607,000 SEK',
		image: '1.png',
		link: 'https://www.volvocars.com/se/cars/xc90-hybrid/',
	},
	{
		id: '2',
		model: 'V60',
		moto: 'All-electric SUV',
		description: 'Recommended price 635,000 SEK',
		image: '2.png',
		link: 'https://www.volvocars.com/se/cars/v60-hybrid/',
	},
	{
		id: '3',
		model: 'XC60',
		moto: 'All-electric SUV',
		description: 'Recommended price 686,000 SEK',
		image: '3.png',
		link: 'https://www.volvocars.com/se/cars/xc60-hybrid/',
	},
	{
		id: '4',
		model: 'XC90',
		moto: 'All-electric SUV',
		description: 'Recommended price 994,000 SEK',
		image: '4.avif',
		link: 'https://www.volvocars.com/se/cars/xc90-hybrid/',
	},
	{
		id: '5',
		model: 'EX30',
		moto: 'All-electric SUV',
		description: 'Recommended price 449,000 SEK',
		image: '5.avif',
		link: 'https://www.volvocars.com/se/cars/xc90-hybrid/',
	},
];

export default function Home() {
	return (
		<div className="flex h-full min-h-[100dvh] items-center justify-center bg-white">
			<Carousel data={mockData} />
		</div>
	);
}
