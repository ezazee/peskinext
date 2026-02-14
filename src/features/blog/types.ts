export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    date: string;
    category: string;
    tags: string[];
}

export interface BlogCategory {
    id: number;
    name: string;
    slug: string;
}
