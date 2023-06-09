import Head from "next/head";
import { Box, Container } from "@mui/material";
import { DashboardLayout } from "src/layout";

import WithAuth from "src/HOC/withAuth";
import { useEffect, useState } from "react";
import { getArticleBySlugAsAdmin } from "src/services/article";
import { useRouter } from "next/router";
import EditorContent from "src/Components/common/editorContent";


const Article = () => {
    const router = useRouter();
    const slug = router.query.slug;
    const [article, setArticle] = useState();

    useEffect(() => {
        async function fetchAll() {
            if (slug) {
                const tempArticle = await getArticleBySlugAsAdmin(slug);
                setArticle(tempArticle);
            }
        }

        fetchAll();
    }, [slug]);


    return (
        <>
            <Head>
                <title>Статья | Parfum Gallery</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                    backgroundColor: "#0F0F0F"
                }}
            >
                <EditorContent content={article?.fullDescription?.ru} />
            </Box>
        </>
    );
};


export default WithAuth(Article);
