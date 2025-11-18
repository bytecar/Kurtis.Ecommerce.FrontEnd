import { httpRequest } from './http';
export const CollectionsAPI = {
    getAllCollections: () => httpRequest('collections', `/api/collections`, 'GET'),
    getAllCollectionsData: (p: any) => httpRequest('collections', `/api/collections`, 'GET', p),
    getAllCollectionsMetadata: (p: any) => httpRequest('collections', `/api/metadata/collections`, 'GET'),
    getCollection: (collectionId: number) => httpRequest('collections', `/api/metadata/collection/${collectionId}`, 'GET'),
    getCollectionByName: (collectionName: string) => httpRequest('collections', `/api/metadata/collection`, 'GET', { name: collectionName }),
    getCollectionByHandle: (collectionHandle: string) => httpRequest('collections', `/api/metadata/collection`, 'GET', { handle: collectionHandle }),
    getCollectionByProduct: (collectionId: number) => httpRequest('collections', `/api/collection/${collectionId}/products`, 'GET'),
    createCollection: (p: any) => httpRequest('collections', `/api/collection`, 'POST', p),
    updateCollection: (collectionId: number, data: any) => httpRequest('collections', `/api/collection/${collectionId}`, 'PATCH', data),
    deleteCollection: (collectionId: number) => httpRequest('collections', `/api/collection/${collectionId}`, 'DELETE'),       
};