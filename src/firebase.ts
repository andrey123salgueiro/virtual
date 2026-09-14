import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  getDoc,
  setDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  getDocs,
  query,
  orderBy 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Product, StoreSettings } from './types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Must pass firestoreDatabaseId according to Firebase skill
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Real-time listener for products
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: unknown) => void
) {
  const path = 'products';
  const productsCol = collection(db, path);
  const q = query(productsCol, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title || '',
          shortDescription: data.shortDescription || '',
          fullDescription: data.fullDescription || '',
          price: Number(data.price) || 0,
          originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
          affiliateUrl: data.affiliateUrl || '',
          imageUrl: data.imageUrl || '',
          platform: data.platform || 'shopee',
          category: data.category || 'gadgets-virais',
          badge: data.badge || undefined,
          freeShipping: data.freeShipping ?? false,
          featured: data.featured ?? false,
          rating: Number(data.rating) || 4.8,
          reviewsCount: Number(data.reviewsCount) || 100,
          createdAt: data.createdAt || new Date().toISOString()
        });
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      if (onError) onError(error);
    }
  );
}

// Save or Update Product in Firestore
export async function saveProductToFirestore(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  try {
    const docRef = doc(db, 'products', product.id);
    await setDoc(docRef, {
      id: product.id,
      title: product.title,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription || '',
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      affiliateUrl: product.affiliateUrl,
      imageUrl: product.imageUrl,
      platform: product.platform,
      category: product.category,
      badge: product.badge || null,
      freeShipping: Boolean(product.freeShipping),
      featured: Boolean(product.featured),
      rating: Number(product.rating || 4.8),
      reviewsCount: Number(product.reviewsCount || 100),
      createdAt: product.createdAt || new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete Product from Firestore
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Real-time listener for store settings
export function subscribeToStoreSettings(
  onUpdate: (settings: StoreSettings) => void,
  onError?: (err: unknown) => void
) {
  const path = 'settings/store';
  const settingsDocRef = doc(db, 'settings', 'store');

  return onSnapshot(
    settingsDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        onUpdate({
          storeName: data.storeName || 'Achadinhos da WEB',
          tagline: data.tagline || '',
          whatsappGroupUrl: data.whatsappGroupUrl || '',
          instagramUrl: data.instagramUrl || '',
          disclosureText: data.disclosureText || '',
          adminPassword: data.adminPassword || 'admin'
        });
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      if (onError) onError(error);
    }
  );
}

// Save Store Settings in Firestore
export async function saveStoreSettingsToFirestore(settings: StoreSettings): Promise<void> {
  const path = 'settings/store';
  try {
    await setDoc(doc(db, 'settings', 'store'), {
      storeName: settings.storeName,
      tagline: settings.tagline,
      whatsappGroupUrl: settings.whatsappGroupUrl || '',
      instagramUrl: settings.instagramUrl || '',
      disclosureText: settings.disclosureText || '',
      adminPassword: settings.adminPassword || 'admin'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Seed initial products and settings if database is empty
export async function seedInitialDataIfEmpty(
  defaultProducts: Product[],
  defaultSettings: StoreSettings
): Promise<void> {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    if (productsSnapshot.empty) {
      console.log('Seeding initial products to Firestore...');
      for (const product of defaultProducts) {
        await saveProductToFirestore(product);
      }
    }

    const settingsDoc = await getDoc(doc(db, 'settings', 'store'));
    if (!settingsDoc.exists()) {
      console.log('Seeding initial store settings to Firestore...');
      await saveStoreSettingsToFirestore(defaultSettings);
    }
  } catch (error) {
    console.error('Error seeding initial data to Firestore:', error);
  }
}
