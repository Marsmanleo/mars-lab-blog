import LangRedirect from './components/LangRedirect';
import componentResolver from './utils/component-resolver';
import {getPageBySlug} from "@/app/[lang]/utils/get-page-by-slug";

// Error Component for displaying error messages
function ErrorMessage({ message }: { message: string }) {
  return (
    <div style={{ 
      padding: '2rem', 
      margin: '2rem auto', 
      maxWidth: '800px', 
      backgroundColor: '#FEF2F2', 
      border: '1px solid #F87171',
      borderRadius: '0.5rem',
      color: '#B91C1C'
    }}>
      <h2 style={{ marginBottom: '1rem' }}>Error</h2>
      <p>{message}</p>
      <p style={{ marginTop: '1rem' }}>
        Please check if you have created an access token using the Strapi admin panel: 
        <a href="http://localhost:1337/admin/" style={{ color: '#2563EB', textDecoration: 'underline' }}>
          http://localhost:1337/admin/
        </a>
      </p>
    </div>
  );
}

export default async function RootRoute({params}: { params: { lang: string } }) {
    try {
      const page = await getPageBySlug('home', params.lang)
      if (page.error && page.error.status == 401)
        throw new Error(
          'Missing or invalid credentials. Have you created an access token using the Strapi admin panel? http://localhost:1337/admin/'
        )

      if (page.data.length == 0 && params.lang !== 'en') return <LangRedirect />
      if (page.data.length === 0) return null
      const contentSections = page.data[0].attributes.contentSections
      return contentSections.map((section: any, index: number) =>
        componentResolver(section, index)
      )
    } catch (error: any) {
      return <ErrorMessage message="Missing or invalid credentials" />;
    }
}
