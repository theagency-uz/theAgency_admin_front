import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Box, Divider, Drawer, useMediaQuery } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import ArticleIcon from "@mui/icons-material/Article";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import LogoutIcon from "@mui/icons-material/Logout";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import AirlineSeatFlatAngledIcon from "@mui/icons-material/AirlineSeatFlatAngled";

import { ChartBar as ChartBarIcon } from "src/assets/icons/chart-bar";
import { Lock as LockIcon } from "src/assets/icons/lock";
import { Users as UsersIcon } from "src/assets/icons/users";
import { Logo } from "src/assets/icons/adminLogo";
import { NavItem } from "./nav-item";
import Accordion from "src/Components/admin/common/accordion";

const items = [
  {
    href: "/",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Главная страница",
  },
  {
    href: "/users",
    icon: <UsersIcon fontSize="small" />,
    title: "Пользователи",
    type: "dropdown",
    submenu: [
      {
        href: "/users",
        icon: <UsersIcon fontSize="small" />,
        title: "Пользователи",
      },
      {
        href: "/users/roles",
        icon: <RecentActorsIcon fontSize="small" />,
        title: "Роли",
      },
    ],
  },
  {
    href: "/blogs",
    icon: <ArticleIcon fontSize="small" />,
    title: "Статьи",
    type: "dropdown",
    submenu: [
      {
        href: "/blogs",
        icon: <ArticleIcon fontSize="small" />,
        title: "Статьи",
      },
      {
        href: "/blogs/category",
        icon: <CategoryIcon fontSize="small" />,
        title: "Категории",
      },
    ],
  },
  {
    href: "/works",
    icon: <WorkIcon fontSize="small" />,
    title: "Работы",
    type: "dropdown",
    submenu: [
      {
        href: "/works",
        icon: <WorkIcon fontSize="small" />,
        title: "Работы",
      },
      {
        href: "/works/category",
        icon: <CategoryIcon fontSize="small" />,
        title: "Категории",
      },
    ],
  },
  {
    href: "/learning",
    icon: <SchoolIcon fontSize="small" />,
    title: "Стажировка",
    type: "dropdown",
    submenu: [
      {
        href: "/learning",
        icon: <SchoolIcon fontSize="small" />,
        title: "Стажировка",
      },
      {
        href: "/learning/category",
        icon: <CategoryIcon fontSize="small" />,
        title: "Категории",
      },
    ],
  },
  {
    href: "/clients",
    icon: <AirlineSeatFlatAngledIcon fontSize="small" />,
    title: "Наши клиенты",
    type: "dropdown",
    submenu: [
      {
        href: "/clients",
        icon: <AirlineSeatFlatAngledIcon fontSize="small" />,
        title: "Наши клиенты",
      },
      {
        href: "/clients/services",
        icon: <SchoolIcon fontSize="small" />,
        title: "Услуги",
      },
    ],
  },
  {
    href: "/login",
    icon: <LockIcon fontSize="small" />,
    title: "Логин",
  },
  {
    href: "/logout",
    icon: <LogoutIcon />,
    title: "Выйти",
  },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <Link href="/" passHref>
              <Logo
                sx={{
                  height: 42,
                  width: 42,
                }}
              />
            </Link>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: "#2D3748",
            my: 3,
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => {
            if (item.submenu) {
              return <Accordion key={item.title} data={item} />;
            }
            return (
              <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
            );
          })}
        </Box>
        <Divider sx={{ borderColor: "#2D3748" }} />
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
