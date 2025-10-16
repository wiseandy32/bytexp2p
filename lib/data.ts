'use client';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface Token {
  id: string;
  name: string;
  shortName: string;
  depositAddress: string;
  logoUrl: string;
  qrCodeUrl: string;
  network: string;
}

export const fetchTokens = async (): Promise<Token[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'cryptocurrencies'));
    const tokens = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        shortName: data.shortName || '',
        depositAddress: data.depositAddress || '',
        logoUrl: data.logoUrl || '',
        qrCodeUrl: data.qrCodeUrl || '',
        network: data.network || '',
      } as Token;
    });
    return tokens;
  } catch (error) {
    console.error("Error fetching tokens: ", error);
    return [];
  }
};
