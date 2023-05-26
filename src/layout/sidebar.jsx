import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Box, Divider, Drawer, useMediaQuery } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import ArticleIcon from "@mui/icons-material/Article";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import VariationIcon from "@mui/icons-material/ChangeHistory";
import WebIcon from "@mui/icons-material/Web";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import ClassIcon from "@mui/icons-material/Class";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import SignalWifiStatusbar4BarIcon from "@mui/icons-material/SignalWifiStatusbar4Bar";
import PrivacyTipRoundedIcon from "@mui/icons-material/PrivacyTipRounded";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import PaidIcon from "@mui/icons-material/Paid";
import QuizIcon from "@mui/icons-material/Quiz";
import LogoutIcon from "@mui/icons-material/Logout";
import RateReviewIcon from "@mui/icons-material/RateReview";
import SmartToyIcon from "@mui/icons-material/SmartToy";

import { ChartBar as ChartBarIcon } from "src/assets/icons/chart-bar";
import { Cog as CogIcon } from "src/assets/icons/cog";
import { Lock as LockIcon } from "src/assets/icons/lock";
import { ShoppingBag as ShoppingBagIcon } from "src/assets/icons/shopping-bag";
import { User as UserIcon } from "src/assets/icons/user";
import { UserAdd as UserAddIcon } from "src/assets/icons/user-add";
import { Users as UsersIcon } from "src/assets/icons/users";
import { XCircle as XCircleIcon } from "src/assets/icons/x-circle";
import { Logo } from "src/assets/icons/adminLogo";
import { NavItem } from "./nav-item";
import Accordion from "src/Components/admin/common/accordion";

const items = [
  {
    href: "/admin",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Главная страница",
  },
  {
    href: "/admin/users",
    icon: <UsersIcon fontSize="small" />,
    title: "Пользователи",
    type: "dropdown",
    submenu: [
      {
        href: "/admin/users",
        icon: <UsersIcon fontSize="small" />,
        title: "Пользователи",
      },
      {
        href: "/admin/users/roles",
        icon: <RecentActorsIcon fontSize="small" />,
        title: "Роли",
      },
    ],
  },
  {
    href: "/admin/pages",
    icon: <WebIcon fontSize="small" />,
    title: "Страницы",
    type: "dropdown",
    submenu: [
      {
        href: "/admin/pages/main",
        icon: <HomeIcon fontSize="small" />,
        title: "Главная страница",
      },
      {
        href: "/admin/pages/about",
        icon: <InfoIcon fontSize="small" />,
        title: "О компании",
      },
      {
        href: "/admin/pages/contact",
        icon: <ContactPhoneIcon fontSize="small" />,
        title: "Контакты",
      },
      {
        href: "/admin/pages/privacy-policy",
        icon: <PrivacyTipRoundedIcon fontSize="small" />,
        title: "Политика конфиденциальности",
      },
      {
        href: "/admin/pages/return-policy",
        icon: <PrivacyTipRoundedIcon fontSize="small" />,
        title: "Политика возврата",
      },
    ],
  },
  {
    href: "/admin/products",
    icon: <ShoppingBagIcon fontSize="small" />,
    title: "Продукты",
    type: "dropdown",
    submenu: [
      {
        href: "/admin/products",
        icon: <ShoppingBagIcon fontSize="small" />,
        title: "Продукты",
      },
      {
        href: "/admin/products/brand",
        icon: <BrandingWatermarkIcon fontSize="small" />,
        title: "Бренды",
      },
      {
        href: "/admin/products/category",
        icon: <CategoryIcon fontSize="small" />,
        title: "Категории",
      },
      {
        href: "/admin/products/types",
        icon: <ClassIcon fontSize="small" />,
        title: "Типы",
      },
      {
        href: "/admin/products/variation",
        icon: <VariationIcon fontSize="small" />,
        title: "Типы вариаций",
      },
      {
        href: "/admin/products/characteristic",
        icon: <FeaturedPlayListIcon fontSize="small" />,
        title: "Характеристики",
      },
    ],
  },
  {
    href: "/admin/orders",
    icon: <BookmarkBorderIcon fontSize="small" />,
    title: "Заказы",
    type: "dropdown",
    submenu: [
      {
        href: "/admin/orders",
        icon: <BookmarkBorderIcon fontSize="small" />,
        title: "Заказы",
      },
      {
        href: "/admin/orders/status",
        icon: <SignalWifiStatusbar4BarIcon fontSize="small" />,
        title: "Статусы",
      },
      {
        href: "/admin/orders/payment",
        icon: <PaidIcon fontSize="small" />,
        title: "Оплата",
      },
    ],
  },
  {
    href: "/admin/blogs",
    icon: <ArticleIcon fontSize="small" />,
    title: "Статьи",
    type: "dropdown",
    submenu: [
      {
        href: "/admin/blogs",
        icon: <ArticleIcon fontSize="small" />,
        title: "Статьи",
      },
      {
        href: "/admin/blogs/category",
        icon: <CategoryIcon fontSize="small" />,
        title: "Категории",
      },
    ],
  },
  {
    href: "/admin/tg",
    icon: <SmartToyIcon fontSize="small" />,
    title: "TG-бот",
    type: "dropdown",
    submenu: [
      {
        href: "/admin/tg/actions",
        icon: <SmartToyIcon fontSize="small" />,
        title: "Акции и скидки",
      },
    ],
  },
  {
    href: "/admin/faq",
    icon: <QuizIcon fontSize="small" />,
    title: "FAQ",
  },
  {
    href: "/admin/account",
    icon: <UserIcon fontSize="small" />,
    title: "Аккаунт",
  },

  {
    href: "/admin/reviews",
    icon: <RateReviewIcon fontSize="small" />,
    title: "Отзывы",
  },
  {
    href: "/admin/system",
    icon: <CogIcon fontSize="small" />,
    title: "Система",
  },
  {
    href: "/admin/login",
    icon: <LockIcon fontSize="small" />,
    title: "Логин",
  },
  {
    href: "/admin/logout",
    icon: <LogoutIcon />,
    title: "Выйти",
  },
  {
    href: "/admin/register",
    icon: <UserAddIcon fontSize="small" />,
    title: "Регистрация",
  },
  {
    href: "/admin/404",
    icon: <XCircleIcon fontSize="small" />,
    title: "Ошибка",
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
            <Link href="/admin" passHref>
              
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
