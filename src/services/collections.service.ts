import { httpRequest } from './http.js';
export const CollectionsAPI = {
    getAllCollections: () => httpRequest('collections', `/api/collections`, 'GET'),
    getAllCollectionsData: (p: any) => httpRequest('collections', `/api/collections`, 'GET', p),
    getAllCollectionsMetadata: (p: any) => httpRequest('collections', `/api/collections`, 'GET'),
    getCollection: (collectionId: number) => httpRequest('collections', `/api/collections/${collectionId}`, 'GET'),
    getCollectionByName: (collectionName: string) => httpRequest('collections', `/api/collections`, 'GET'),
    getCollectionByHandle: (collectionHandle: string) => httpRequest('collections', `/api/collections`, 'GET'),
    getCollectionByProduct: (collectionId: number) => httpRequest('collections', `/api/collections/${collectionId}`, 'GET'),
    createCollection: (p: any) => httpRequest('collections', `/api/collections`, 'POST', p),
    updateCollection: (collectionId: number, data: any) => httpRequest('collections', `/api/collections/${collectionId}`, 'PUT', data),
    deleteCollection: (collectionId: number) => httpRequest('collections', `/api/collections/${collectionId}`, 'DELETE'),
};
