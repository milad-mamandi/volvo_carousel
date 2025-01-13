'use client';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';

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

	const dataWithInvisibleImage = [{...data[data.length - 1], image: ''}, ...data, {...data[0], image: ''}];

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
		<div className="bg-muted flex h-[800px] w-[1200px] flex-col">
			<div className="flex-col p-16">
				<div className="flex flex-row items-center justify-between">
					<span className="text-3xl">
						{dataWithInvisibleImage[position].model}
						<span className="text-muted-foreground ms-2">{dataWithInvisibleImage[position].moto}</span>
					</span>
					<div className="flex flex-row gap-2">
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
			<div className="relative mt-8 flex grow flex-row items-center justify-center overflow-clip">
				{dataWithInvisibleImage.map((data, index) => (
					<div
						className={cn(
							'relative h-full w-1/3 shrink-0 transition-all duration-700 ease-in-out',
							{'w-2/3': index === position},
							{'w-0': index < position - 1},
							{'w-0': index > position + 1},
						)}
						key={`${index}-${data.id}`}
					>
						<Link href={data.link} target="_blank">
							{data.image && (
								<Image src={`/${data.image}`} fill className="h-20 object-contain" alt="volvo pic" />
							)}
						</Link>
					</div>
				))}
			</div>
			<div className="mb-12 mt-4 h-1 w-full px-4">
				<div
					className="h-0.5 bg-black transition-all duration-700 ease-in-out"
					style={{
						width: `${100 / (dataWithInvisibleImage.length - 2)}%`,
						transform: `translateX(${(position - 1) * 100}%)`,
					}}
				/>
			</div>
		</div>
	);
}
