'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { usePen } from '@/modules/pens/hooks/usePen';
import { PenDetail } from '@/modules/pens/ui/PenDetail';

export default function PenDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const { penDetail, loadingDetail, fetchPenDetail } = usePen();

  useEffect(() => {
    if (id) {
      fetchPenDetail(id);
    }
  }, [id, fetchPenDetail]);

  return (
    <div className="space-y-4 pb-20 bg-[#fbfcfd] min-h-screen -m-4 p-4">
      <div className="flex items-center justify-between">
        <Link
          href="/pens"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách chuồng
        </Link>
      </div>

      <div className="bg-white rounded-xl p-4">
        <PenDetail
          pen={penDetail}
          loading={loadingDetail}
          onClose={() => router.push('/pens')}
        />
      </div>
    </div>
  );
}
