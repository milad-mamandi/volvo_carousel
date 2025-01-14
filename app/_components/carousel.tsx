'use client'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {TouchEvent, useMemo, useState} from 'react'
import {useDebounce} from 'use-debounce'

type VolvoData = {
	id: string
	model: string
	moto: string
	description: string
	image: string
	link: string
}

export default function Carousel({data}: {data: VolvoData[]}) {
	const [position, setPosition] = useState(1)
	const [isNavigating, setIsNavigating] = useState(false)

	const dataWithInvisibleImage = useMemo(() => [{...data[0], image: ''}, ...data, {...data[0], image: ''}], [data])

	const MIN_POSITION = 1
	const MAX_POSITION = dataWithInvisibleImage.length - 2
	const NAVIGATION_DURATION = 350

	const updatePosition = (delta: number) => {
		if (isNavigating) return
		setIsNavigating(true)

		setPosition(prev => {
			const newPosition = prev + delta

			if (newPosition < MIN_POSITION || newPosition > MAX_POSITION) return prev
			return newPosition
		})

		setTimeout(() => setIsNavigating(false), NAVIGATION_DURATION)
	}

	const nextPosition = () => updatePosition(1)
	const prevPosition = () => updatePosition(-1)

	return (
		<div className="flex h-[600px] w-[1200px] flex-col bg-muted xl:h-[800px]">
			<Header
				model={dataWithInvisibleImage[position].model}
				moto={dataWithInvisibleImage[position].moto}
				description={dataWithInvisibleImage[position].description}
				link={dataWithInvisibleImage[position].link}
				isPrevDisabled={position === MIN_POSITION}
				isNextDisabled={position === MAX_POSITION}
				prevPosition={prevPosition}
				nextPosition={nextPosition}
			/>
			<Slider
				data={dataWithInvisibleImage}
				position={position}
				prevPosition={prevPosition}
				nextPosition={nextPosition}
			/>
			<Scrollbar length={MAX_POSITION} position={position} />
		</div>
	)
}

const Header = ({
	model,
	moto,
	description,
	link,
	isPrevDisabled,
	isNextDisabled,
	prevPosition,
	nextPosition,
}: {
	model: string
	moto: string
	description: string
	link: string
	isPrevDisabled: boolean
	isNextDisabled: boolean
	prevPosition: () => void
	nextPosition: () => void
}) => {
	return (
		<div className="select-none flex-col p-6 xl:p-16">
			<div className="flex flex-row items-center justify-between gap-4">
				<div className="flex flex-col gap-2 md:flex-row">
					<span className="text-3xl">{model}</span>
					<span className="text-3xl text-muted-foreground">{moto}</span>
				</div>
				<div className="flex flex-row gap-2">
					<Button
						className="size-10 rounded-full"
						onClick={prevPosition}
						disabled={isPrevDisabled}
						aria-label="Previous Image"
					>
						<ChevronLeft strokeWidth={1.5} />
					</Button>
					<Button
						className="size-10 rounded-full"
						onClick={nextPosition}
						disabled={isNextDisabled}
						aria-label="Next Image"
					>
						<ChevronRight strokeWidth={1.5} />
					</Button>
				</div>
			</div>
			<div className="mt-4">
				<span className="text-muted-foreground">{description}</span>
			</div>
			<Link href={link} target="_blank" aria-label={`Explore ${model}`}>
				<Button className="mt-8 h-12 w-32 rounded-sm text-lg">Explore</Button>
			</Link>
		</div>
	)
}

const Slider = ({
	data,
	position,
	nextPosition,
	prevPosition,
}: {
	data: VolvoData[]
	position: number
	prevPosition: () => void
	nextPosition: () => void
}) => {
	const SWIPE_THRESHOLD = 50
	const DEBOUNCE_DURATION = 100

	const [startX, setStartX] = useState<number | null>(null)
	const [debouncedX] = useDebounce(startX, DEBOUNCE_DURATION)

	const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
		setStartX(e.touches[0].clientX)
	}

	const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
		if (!debouncedX) return

		const endX = e.touches[0].clientX
		const deltaX = debouncedX - endX

		if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
			if (deltaX > 0) {
				nextPosition()
			} else {
				prevPosition()
			}
			setStartX(null)
		}
	}
	return (
		<div className="relative flex grow flex-row items-center justify-center overflow-clip xl:mt-8">
			{data.map((item, index) => (
				<div
					className={cn(
						'invisible relative h-full w-full shrink-0 transition-all duration-700 ease-in-out sm:visible sm:w-4/12',
						{'visible w-full sm:-mx-10 sm:w-9/12 xl:mx-0': index === position},
						{'w-0 sm:w-0': Math.abs(index - position) > 1},
					)}
					key={`${index}-${item.id}`}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
				>
					<Link href={item.link} target="_blank">
						{item.image && (
							<Image src={`/${item.image}`} fill className="object-contain" alt={`${item.model} image`} />
						)}
					</Link>
				</div>
			))}
		</div>
	)
}

const Scrollbar = ({length, position}: {length: number; position: number}) => {
	const progressBarWidth = `${100 / length}%`
	const progressBarTransform = `translateX(${(position - 1) * 100}%)`
	return (
		<div className="mx-8 pb-12">
			<div className="h-0.5 bg-gray-300">
				<div
					className="h-0.5 bg-black transition-all duration-700 ease-in-out"
					style={{
						width: progressBarWidth,
						transform: progressBarTransform,
					}}
				/>
			</div>
		</div>
	)
}
