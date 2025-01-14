'use client';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {TouchEvent, useState} from 'react';

type VolvoData = {
	id: string;
	model: string;
	moto: string;
	description: string;
	image: string;
	link: string;
};

export default function Carousel({data}: {data: VolvoData[]}) {
	const [position, setPosition] = useState(1);
	const [startX, setStartX] = useState<number | null>(null);

	const dataWithInvisibleImage = [{...data[0], image: ''}, ...data, {...data[0], image: ''}];

	const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
		setStartX(e.touches[0].clientX);
	};

	const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
		if (!startX) return;

		const endX = e.touches[0].clientX;
		const deltaX = startX - endX;

		if (deltaX > 50) {
			nextPosition();
			setStartX(null);
		} else if (deltaX < -50) {
			prevPosition();
			setStartX(null);
		}
	};

	const nextPosition = () =>
		setPosition(prev => {
			if (prev === dataWithInvisibleImage.length - 2) return prev;
			return prev + 1;
		});
	const prevPosition = () =>
		setPosition(prev => {
			if (prev === 1) return prev;
			return prev - 1;
		});

	return (
		<div className="flex h-[600px] w-[1200px] flex-col bg-muted xl:h-[800px]">
			<div className="flex-col p-6 xl:p-16">
				<div className="flex flex-row items-center justify-between gap-4">
					<div className="flex flex-col gap-2 text-3xl md:flex-row">
						{dataWithInvisibleImage[position].model}
						<span className="text-muted-foreground">{dataWithInvisibleImage[position].moto}</span>
					</div>
					<div className="flex shrink-0 flex-row gap-2">
						<Button className="size-10 rounded-full" onClick={prevPosition} disabled={position === 1}>
							<ChevronLeft strokeWidth={1.5} />
						</Button>
						<Button
							className="size-10 rounded-full"
							onClick={nextPosition}
							disabled={position === dataWithInvisibleImage.length - 2}
						>
							<ChevronRight strokeWidth={1.5} />
						</Button>
					</div>
				</div>
				<div className="mt-4">
					<span className="text-muted-foreground">{dataWithInvisibleImage[position].description}</span>
				</div>
				<Link href={dataWithInvisibleImage[position].link} target="_blank">
					<Button className="mt-8 h-12 w-32 rounded-sm text-lg">Explore</Button>
				</Link>
			</div>
			<div className="relative flex h-fit grow flex-row items-center justify-center overflow-clip xl:mt-8">
				{dataWithInvisibleImage.map((data, index) => (
					<div
						className={cn(
							'invisible relative h-full w-full shrink-0 transition-all duration-700 ease-in-out sm:visible sm:w-4/12 md:block',
							{'visible w-full sm:-mx-10 sm:w-9/12 xl:mx-0': index === position},
							{'w-0 sm:w-0': index < position - 1},
							{'w-0 sm:w-0': index > position + 1},
						)}
						key={`${index}-${data.id}`}
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
					>
						<Link href={data.link} target="_blank">
							{data.image && (
								<Image src={`/${data.image}`} fill className="h-20 object-contain" alt="volvo pic" />
							)}
						</Link>
					</div>
				))}
			</div>
			<div className="mx-8 pb-12">
				<div className="h-0.5 bg-gray-300">
					<div
						className="h-0.5 bg-black transition-all duration-700 ease-in-out"
						style={{
							width: `${100 / (dataWithInvisibleImage.length - 2)}%`,
							transform: `translateX(${(position - 1) * 100}%)`,
						}}
					/>
				</div>
			</div>
		</div>
	);
}
