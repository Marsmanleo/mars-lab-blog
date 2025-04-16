import { fetchAPI } from '@/app/[lang]/utils/fetch-api';
import Post from '@/app/[lang]/views/post';
import type { Metadata } from 'next';

async function getPostBySlug(slug: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const urlParamsObject = {
        filters: { slug },
        populate: {
            cover: { fields: ['url'] },
            authorsBio: { populate: '*' },
            category: { fields: ['name'] },
            blocks: { 
                populate: {
                    '__component': '*', 
                    'files': '*',
                    'file': '*',
                    'url': '*',
                    'body': '*',
                    'title': '*',
                    'author': '*',
                }
            },
        },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const response = await fetchAPI(path, urlParamsObject, options);
    return response;
}

async function getMetaData(slug: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const urlParamsObject = {
        filters: { slug },
        populate: { seo: { populate: '*' } },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const response = await fetchAPI(path, urlParamsObject, options);
    return response.data;
}

export async function generateStaticParams() {
    try {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
        const path = `/articles`;
        const options = { headers: { Authorization: `Bearer ${token}` } };
        const articleResponse = await fetchAPI(
            path,
            {
                populate: ['category'],
            },
            options
        );

        if (!articleResponse?.data) {
            return [];
        }

        return articleResponse.data.map(
            (article: {
                attributes: {
                    slug: string;
                    category: {
                        data: {
                            attributes: {
                                slug: string;
                            };
                        };
                    };
                };
            }) => ({
                slug: article.attributes.slug,
                category: article.attributes.category?.data?.attributes?.slug || 'uncategorized'
            })
        );
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

export default async function PostRoute({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = params;
    const response = await getPostBySlug(slug);
    if (response.data.length === 0) return <h2>no post found</h2>;
    return <Post data={response.data[0]} />;
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const meta = await getMetaData(params.slug);
    if (!meta.length) return {};

    const metadata = meta[0].attributes.seo;

    return {
        title: metadata.metaTitle,
        description: metadata.metaDescription,
    };
}
