import Head from "next/head";
import { Box, Container } from "@mui/material";
import { DashboardLayout } from "src/layout";

import WithAuth from "src/HOC/withAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EditorContent from "src/Components/common/editorContent";
import { getWorkBySlugAsAdmin } from "src/services/work";


const Article = () => {
    const router = useRouter();
    const slug = router.query.slug;
    const [work, setWork] = useState();

    useEffect(() => {
        async function fetchAll() {
            if (slug) {
                const tempWork = await getWorkBySlugAsAdmin(slug);
                setWork(tempWork);
            }
        }

        fetchAll();
    }, [slug]);


    return (
        <>
            <Head>
                <title>Работа | The Agency</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                    backgroundColor: "#0F0F0F"
                }}
            >
                <EditorContent content={work?.description?.ru} type={work?.type} />
            </Box>
        </>
    );
};


export default WithAuth(Article);
