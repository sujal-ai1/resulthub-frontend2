import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Battle Mode — DTU & NSUT Branch Showdown',
  description:
    'Head-to-head academic showdowns on Result Hub — see which DTU or NSUT branch and batch performs best, powered by real semester results.',
  alternates: { canonical: 'https://www.resulthubnsut.com/battle' },
};

import BattleClient from "@/components/BattleClient";

export default function BattlePage() {
    return <BattleClient />;
}
