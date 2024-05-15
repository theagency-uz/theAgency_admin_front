import Head from "next/head";
import { Box, Container } from "@mui/material";
import { DashboardLayout } from "src/layout";

import WithAuth from "src/HOC/withAuth";
import { useEffect, useState } from "react";
import { getLearningBySlugAsAdmin } from "src/services/learning";
import { useRouter } from "next/router";
import EditorContent from "src/Components/common/editorContent";


const Article = () => {
    const router = useRouter();
    const slug = router.query.slug;
    const [article, setArticle] = useState();

    useEffect(() => {
        async function fetchAll() {
            if (slug) {
                const tempArticle = await getLearningBySlugAsAdmin(slug);
                setArticle(tempArticle);
            }
        }

        fetchAll();
    }, [slug]);


    return (
        <>
            <Head>
                <title>Статья | The Agency</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                    backgroundColor: "#0F0F0F",
                    display: "flex",
                    flexDirection: "column",
                    gap: "50px"
                }}
            >
                {article?.article_blocks?.map(block => <EditorContent key={block.id} content={block?.description?.ru} />)}

            </Box>
        </>
    );
};


export default WithAuth(Article);
