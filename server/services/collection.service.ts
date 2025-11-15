import { httpRequest } from './http';
export const CollectionAPI = {
    getAllCollections: () => httpRequest('collection', `/api/collections`, 'GET'),
    getAllCollectionsData: (p: any) => httpRequest('collection', `/api/collections`, 'GET'),
    getAllCollectionsMetadata: (p: any) => httpRequest('collection', `/api/metadata/collections`, 'GET'),
    getCollection: (collectionId: number) => httpRequest('collection', `/api/metadata/collection/${collectionId}`, 'GET'),
    getCollectionByName: (collectionName: string) => httpRequest('collection', `/api/metadata/collection`, 'GET', { name: collectionName }),
    getCollectionByHandle: (collectionHandle: string) => httpRequest('collection', `/api/metadata/collection`, 'GET', { handle: collectionHandle }),
    getCollectionByProduct: (collectionId: number) => httpRequest('collection', `/api/collection/${collectionId}/products`, 'GET'),
    createCollection: (p: any) => httpRequest('collection', `/api/collection`, 'POST', p),
    updateCollection: (collectionId: number, data: any) => httpRequest('collection', `/api/collection/${collectionId}`, 'PATCH', data),
    deleteCollection: (collectionId: number) => httpRequest('collection', `/api/collection/${collectionId}`, 'DELETE'),  
    
};