'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageContainer from '@/components/layout/PageContainer';
import { ArrowLeft } from 'lucide-react';

export default function AdminOffers() {
  return (
    <PageContainer>
      <section className="bg-hero-gradient py-8 md:py-10">
        <div className="container-custom flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Offers Management
            </h1>
            <p className="text-white/80">
              Create and manage job offers.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/dashboard" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-custom text-center">
          <p className="text-muted-foreground">No offers created yet.</p>
        </div>
      </section>
    </PageContainer>
  );
}
