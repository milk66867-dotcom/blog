// src/services/content/index.ts
export {
    getAllPosts,
    getPostBySlug,
    getPostsByTag,
    getPostsByCategory,
    getRelatedPosts,
} from './posts.service';

export { getAllTags } from './tags.service';
export { getAllCategories } from './categories.service';
export { getArchive } from './archive.service';
export { getAdjacentPosts } from './adjacent.service';