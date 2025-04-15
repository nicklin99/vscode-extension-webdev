import { defineComponent, PropType, Slot, type FunctionalComponent } from "vue";
import {
  Aside as TAside,
  Header as THeader,
  HeadMenu as THeadMenu,
  Menu as TMenu,
  MenuItem as TMenuItem,
  Layout as TLayout,
  Content as TContent,
  Space as TSpace,
} from "tdesign-vue-next";

import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import logo from "@/assets/logo.png?inline";
import { useMediaQuery } from "@vueuse/core";
import MainContent from "./MainContent.vue";

export const MenuLayout: FunctionalComponent<{
  lg: boolean;
  width: string;
  menu?: Slot;
}> = ({ lg, width, menu }) => {
  return lg ? (
    <TAside width={width}>
      <MainMenu lg={lg} width={width} menu={menu} />
    </TAside>
  ) : (
    <THeader>
      <MainMenu lg={lg} width={width} menu={menu} />
    </THeader>
  );
};

export const MainMenu = defineComponent({
  name: "MainMenu",
  props: {
    lg: Boolean as PropType<boolean>,
    width: String as PropType<string>,
    menu: Function as PropType<Slot>,
  },
  setup(props) {
    const active = ref<string>();
    const route = useRoute();

    watchEffect(() => {
      active.value = route.name as string;
    });

    return () => {
      const { lg, menu, width } = props;
      const renderLogo = () => (
        <TSpace align="center">
          <img height="28" src={logo} alt="logo" />
          { lg ? <span>Web开发</span> : null}
        </TSpace>
      );
      const renderMenus = () => {
        return <TMenuItem value="Home"> 项目 </TMenuItem>;
      };
      const renderBottom = () => {
        return (
          <>
            <p>欢迎使用v1.0</p>
            <p class="breakline">Seafront 海滨</p>
          </>
        );
      };
      if (lg) {
        return (
          <TMenu
            theme="dark"
            width={width}
            v-model={active.value}
            v-slots={{
              logo: renderLogo,
              default: menu || renderMenus,
              operations: renderBottom,
            }}
          ></TMenu>
        );
      } else {
        return (
          <THeadMenu
            theme="dark"
            v-model={active.value}
            v-slots={{
              logo: renderLogo,
              default: menu || renderMenus,
            }}
          ></THeadMenu>
        );
      }
    };
  },
});

export const MainLayout = defineComponent({
  name: "MainLayout",
  setup(_, { slots }) {
    const isLargeScreen = useMediaQuery("(min-width: 768px)");
    return () => (
      <TLayout>
        <MenuLayout width="160px" lg={isLargeScreen.value} menu={slots.menu} />
        <TContent>
          <MainContent v-slots={slots} />
        </TContent>
      </TLayout>
    );
  },
});
