import React from 'react';
import { cn } from '@/shared/utils/utils';

type KPITone = 'emerald' | 'blue' | 'amber' | 'rose' | 'slate';
type KPITrend = 'up' | 'down' | 'neutral';

const toneStyles: Record<KPITone, { value: string; icon: string; badge: string }> = {
	emerald: {
		value: 'text-emerald-900',
		icon: 'text-emerald-600',
		badge: 'bg-emerald-50 text-emerald-700',
	},
	blue: {
		value: 'text-blue-900',
		icon: 'text-blue-600',
		badge: 'bg-blue-50 text-blue-700',
	},
	amber: {
		value: 'text-amber-900',
		icon: 'text-amber-600',
		badge: 'bg-amber-50 text-amber-700',
	},
	rose: {
		value: 'text-rose-900',
		icon: 'text-rose-600',
		badge: 'bg-rose-50 text-rose-700',
	},
	slate: {
		value: 'text-slate-900',
		icon: 'text-slate-600',
		badge: 'bg-slate-100 text-slate-700',
	},
};

const trendStyles: Record<KPITrend, string> = {
	up: 'bg-emerald-50 text-emerald-700',
	down: 'bg-rose-50 text-rose-700',
	neutral: 'bg-slate-100 text-slate-700',
};

export interface KPICardProps {
	label: string;
	value: string | number;
	icon?: React.ElementType;
	subtitle?: string;
	badge?: string;
	tone?: KPITone;
	trend?: KPITrend;
	trendLabel?: string;
	loading?: boolean;
	onClick?: () => void;
	className?: string;
}

export function KPICard({
	label,
	value,
	icon: Icon,
	subtitle,
	badge,
	tone = 'emerald',
	trend,
	trendLabel,
	loading = false,
	onClick,
	className,
}: KPICardProps) {
	const styles = toneStyles[tone];

	return (
		<div
			className={cn(
				'relative overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow',
				onClick && 'cursor-pointer hover:shadow-md',
				className
			)}
			>
			{Icon ? (
				<div className={cn('absolute right-3 top-3', styles.icon)}>
				<Icon size={18} />
				</div>
			) : null}

			<div className="flex h-full flex-col items-start justify-center text-left">
				<div className="mb-1 flex items-left gap-2">
				<p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
					{label}
				</p>

				{badge ? (
					<span
					className={cn(
						'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase',
						styles.badge
					)}
					>
					{badge}
					</span>
				) : null}
				</div>

				{loading ? (
				<div className="h-8 w-24 animate-pulse rounded bg-slate-100" />
				) : (
				<div className="flex flex-col items-start">
					<h3 className={cn('text-3xl font-black leading-none', styles.value)}>
					{value}
					</h3>

					{trend && trendLabel ? (
					<span
						className={cn(
						'mt-2 inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold',
						trendStyles[trend]
						)}
					>
						{trendLabel}
					</span>
					) : null}
				</div>
				)}

				{subtitle ? (
				<p className="mt-2 text-xs font-medium text-slate-500">
					{subtitle}
				</p>
				) : null}
			</div>
			</div>
	);
}

export default KPICard;