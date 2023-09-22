"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

import "suneditor/src/lang/ru";

import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

import classes from "./styles.module.css";
import { getJwt } from "src/services/auth";
import apiBaseUrl from "src/utils/endpoint";
import { postEditor } from "src/services/editor";
import Loading from "../Loading";

export default function SunEditor({ value = "", type = "", onChange }) {
  const [plugins, setPlugins] = useState();

  useEffect(() => {
    async function importFunc() {
      const { default: colorPicker } = await import("suneditor/src/plugins/modules/_colorPicker");

      const tempPlugins = await import("suneditor/src/plugins");

      let bgColor;
      let tableAlign;
      let tableInvert;

      bgColor = {
        name: "bgColor",
        display: "submenu",
        innerHTML: "фон",
        add: function (core, targetElement) {
          core.addModule([colorPicker]);
          const rangeTag = core.util.createElement("DIV");
          core.util.addClass(rangeTag, "__se__tag__bg__color");
          const context = core.context;
          context.bgColor = {
            rangeTag: rangeTag,
            previewEl: null,
            colorInput: null,
            colorList: null,
          };

          /** set submenu */
          let listDiv = this.setSubmenu(core);
          context.bgColor.colorInput = listDiv.querySelector("._se_color_picker_input");

          /** add event listeners */
          context.bgColor.colorInput.addEventListener("keyup", this.onChangeInput.bind(core));
          listDiv
            .querySelector("._se_color_picker_submit")
            .addEventListener("click", this.submit.bind(core));
          listDiv
            .querySelector("._se_color_picker_remove")
            .addEventListener("click", this.remove.bind(core));
          listDiv.addEventListener("click", this.pickup.bind(core));

          context.bgColor.colorList = listDiv.querySelectorAll("li button");

          /** append target button menu */
          core.initMenuTarget(this.name, targetElement, listDiv);

          /** empty memory */
          listDiv = null;
        },

        setSubmenu: function (core) {
          const colorArea = core.context.colorPicker.colorListHTML;
          const listDiv = core.util.createElement("DIV");

          listDiv.className = "se-submenu se-list-layer";
          listDiv.innerHTML = colorArea;

          return listDiv;
        },

        /**
         * @Override submenu
         */
        on: function () {
          const contextPicker = this.context.colorPicker;
          const contextBgColor = this.context.bgColor;

          contextPicker._colorInput = contextBgColor.colorInput;
          const color = this.wwComputedStyle.backgroundColor;
          contextPicker._defaultColor = color
            ? this.plugins.colorPicker.isHexColor(color)
              ? color
              : this.plugins.colorPicker.rgb2hex(color)
            : "#ffffff";
          contextPicker._styleProperty = "backgroundColor";
          contextPicker._colorList = contextBgColor.colorList;

          this.plugins.colorPicker.init.call(this, this.getSelectionNode(), null);
        },

        /**
         * @Override _colorPicker
         */
        onChangeInput: function (e) {
          this.plugins.colorPicker.setCurrentColor.call(this, e.target.value);
        },

        submit: function () {
          this.plugins.bgColor.applyColor.call(this, this.context.colorPicker._currentColor);
        },

        pickup: function (e) {
          e.preventDefault();
          e.stopPropagation();

          this.plugins.bgColor.applyColor.call(this, e.target.getAttribute("data-value"));
        },

        remove: function () {
          const rangeTag = this.util.getParentElement(this.getSelectionNode(), "div");

          if (this.util.hasClass(rangeTag, "__se__tag__bg__color")) {
            this.detachRangeFormatElement(rangeTag, null, null, false, false);
          }

          this.submenuOff();
        },

        applyColor: function (color) {
          if (!color) return;

          const rangeTag = this.util.getParentElement(this.getSelectionNode(), "div");

          if (!this.util.hasClass(rangeTag, "__se__tag__bg__color")) {
            this.context.bgColor.rangeTag.style.backgroundColor = color;
            this.applyRangeFormatElement(this.context.bgColor.rangeTag.cloneNode(false));
          }

          this.submenuOff();
        },
      };
      tableAlign = {
        name: "tableAlign",
        display: "submenu",
        innerHTML: ``,
        add: function (core, targetElement) {
          const icons = core.icons;
          const context = core.context;
          context.align = {
            targetButton: targetElement,
            _itemMenu: null,
            _alignList: null,
            currentAlign: "top",
            defaultDir: "top",
            icons: {
              top: icons.align_left,
              bottom: icons.align_right,
              middle: icons.align_center,
            },
          };

          /** set submenu */
          let listDiv = this.setSubmenu(core);
          let listUl = (context.align._itemMenu = listDiv.querySelector("ul"));

          /** add event listeners */
          listUl.addEventListener("click", this.pickup.bind(core));
          context.align._alignList = listUl.querySelectorAll("li button");

          /** append target button menu */
          core.initMenuTarget(this.name, targetElement, listDiv);

          /** empty memory */
          (listDiv = null), (listUl = null);
        },

        setSubmenu: function (core) {
          const lang = core.lang;
          const icons = core.icons;
          const listDiv = core.util.createElement("DIV");
          const alignItems = ["top", "middle", "bottom"];

          let html = "";
          for (let i = 0; i < alignItems.length; i++) {
            let item = alignItems[i];
            html +=
              "<li>" +
              '<button type="button" class="se-btn-list se-btn-align" data-value="' +
              item +
              '" title="' +
              item +
              '" aria-label="' +
              item +
              '">' +
              '<span class="se-list-icon">' +
              item +
              "</span>" +
              "</button>" +
              "</li>";
          }

          listDiv.className = "se-submenu se-list-layer se-list-align";
          listDiv.innerHTML =
            "" +
            '<div class="se-list-inner">' +
            '<ul class="se-list-basic">' +
            html +
            "</ul>" +
            "</div>";

          return listDiv;
        },

        /**
         * @Override core
         */
        active: function (element) {
          const alignContext = this.context.align;
          const targetButton = alignContext.targetButton;
          const target = targetButton.firstElementChild;

          if (!element) {
            this.util.changeElement(target, alignContext.icons[alignContext.defaultDir]);
            targetButton.removeAttribute("data-focus");
          } else if (this.util.isFormatElement(element)) {
            const textAlign = element.style.textAlign;
            if (textAlign) {
              this.util.changeElement(
                target,
                alignContext.icons[textAlign] || alignContext.icons[alignContext.defaultDir]
              );
              targetButton.setAttribute("data-focus", textAlign);
              return true;
            }
          }

          return false;
        },

        /**
         * @Override submenu
         */
        on: function () {
          const alignContext = this.context.align;
          const alignList = alignContext._alignList;
          const currentAlign =
            alignContext.targetButton.getAttribute("data-focus") || alignContext.defaultDir;

          if (currentAlign !== alignContext.currentAlign) {
            for (let i = 0, len = alignList.length; i < len; i++) {
              if (currentAlign === alignList[i].getAttribute("data-value")) {
                this.util.addClass(alignList[i], "active");
              } else {
                this.util.removeClass(alignList[i], "active");
              }
            }

            alignContext.currentAlign = currentAlign;
          }
        },

        exchangeDir: function () {
          const dir = this.options.rtl ? "right" : "left";
          if (!this.context.align || this.context.align.defaultDir === dir) return;

          this.context.align.defaultDir = dir;
          let menu = this.context.align._itemMenu;
          let leftBtn = menu.querySelector('[data-value="left"]');
          let rightBtn = menu.querySelector('[data-value="right"]');
          if (leftBtn && rightBtn) {
            const lp = leftBtn.parentElement;
            const rp = rightBtn.parentElement;
            lp.appendChild(rightBtn);
            rp.appendChild(leftBtn);
          }
        },

        pickup: function (e) {
          e.preventDefault();
          e.stopPropagation();

          let target = e.target;
          let value = null;

          while (!value && !/UL/i.test(target.tagName)) {
            value = target.getAttribute("data-value");
            target = target.parentNode;
          }

          if (!value) return;

          const defaultDir = this.context.align.defaultDir;
          const selectedFormsts = this.getSelectedElements();
          for (let i = 0, len = selectedFormsts.length; i < len; i++) {
            let td = selectedFormsts[i].closest("td");
            if (td) {
              td.removeAttribute("class");
              td.classList.add("__se__" + value);
              this.util.setStyle(td, "verticalAlign", value === defaultDir ? "" : value);
            }
          }

          this.effectNode = null;
          this.submenuOff();
          this.focus();

          // history stack
          this.history.push(false);
        },
      };

      tableInvert = {
        // @Required @Unique
        // plugin name
        name: "tableInvert",
        // @Required
        // data display
        display: "command",

        // @Options
        title: "Инвертация таблицы",
        buttonClass: "",
        innerHTML: "invert",

        // @Required
        // add function - It is called only once when the plugin is first run.
        // This function generates HTML to append and register the event.
        // arguments - (core : core object, targetElement : clicked button element)
        add: function (core, targetElement) {
          const context = core.context;

          // @Required
          // Registering a namespace for caching as a plugin name in the context object
          context.tableInvert = {
            targetButton: targetElement,
          };
        },

        // @Override core
        // Plugins with active methods load immediately when the editor loads.
        // Called each time the selection is moved.
        active: function (element) {
          if (!element) {
            this.util.removeClass(this.context.tableInvert.targetButton, "active");
          } else if (this.util.hasClass(element, "__se__tag__table__invert")) {
            this.util.addClass(this.context.tableInvert.targetButton, "active");
            return true;
          }

          return false;
        },

        // @Required, @Override core
        // The behavior of the "command plugin" must be defined in the "action" method.
        action: function () {
          const table = this.util.getParentElement(this.getSelectionNode(), "table");

          // const rangeTag = this.util.getParentElement(this.getSelectionNode(), "div");

          if (this.util.hasClass(table, "__se__tag__table__invert")) {
            this.util.removeClass(table, "__se__tag__table__invert");
          } else {
            this.util.addClass(table, "__se__tag__table__invert");
          }
          // console.log("content: ", this.getContents());
          this.setContents(this.getContents());
        },
      };

      setPlugins([...Object.values(tempPlugins), bgColor, tableAlign, tableInvert]);
    }
    importFunc();
  }, []);

  const editorOptions = {
    stickyToolbar: "64px",
    className: type === "modal" ? `${classes.editor} ${classes.modal}` : classes.editor,
    height: 400,
    plugins: plugins ? plugins : [],

    buttonList: [
      ["undo", "redo"],
      ["fontSize", "font", "formatBlock"],
      ["paragraphStyle", "blockquote"],
      ["bold", "underline", "italic", "strike", "subscript", "superscript"],
      ["fontColor", "hiliteColor", "textStyle"],
      ["removeFormat"],
      ["align", "horizontalRule", "list"],
      ["table", "tableAlign", "tableInvert", "link", "image", "video"],
      ["imageGallery", "fullScreen"],
      [("showBlocks", "codeView")],
      ["bgColor"],
      ["template"],
    ],
    imageRotation: true,
    fontSize: [12, 14, 16, 18, 20, 25, 30, 35, 40, 42, 45, 50],
    font: ["Inter", "Prata"],
    templates: [
      {
        name: "Статья оригинал",
        html: `
        <p><span style="font-family: Prata">​</span><br>
        </p>
        <p></p>
        <p><span style="font-family: Prata;font-size: 20px">​</span></p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <table class="se-table-layout-fixed">
                        <tbody>
             <tr>
               <td class="__se__top">
                                                                        <h2><span style="font-family: Prata"><span style="font-family:Prata">КАК ОТЛИЧИТЬ</span><br>
        
        ПАРФЮМ ОРИГИНАЛ<br>
        
        ОТ ПОДДЕЛКИ</span></h2>
         </td>
               <td class="__se__top">
                                                                        <div>Сейчас пытаются подделать практически всё, что&nbsp;хорошо продаётся и&nbsp;парфюмерия в&nbsp;этом списке занимает чуть&nbsp;ли&nbsp;не&nbsp;первое место. Даже&nbsp;если вы&nbsp;не&nbsp;покупаете духи в&nbsp;каком-нибудь ларьке, стоит знать, как&nbsp;отличить оригинал от&nbsp;подделки.<br>
        <br>
        
        
        
        
        
        
        
        Некоторые намеренно покупают реплики любимых композиций&nbsp;— ведь&nbsp;оригинал им&nbsp;не&nbsp;по&nbsp;карману. Но&nbsp;подделку можно приобрести за&nbsp;полную цену и, даже<span style="background-color: transparent">&nbsp;не&nbsp;подозревать об&nbsp;этом.</span></div>
         </td>
         </tr>
         </tbody>
        </table>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <div class="se-component se-image-container __se__float-none">              
          <figure>
             <img src="https://spaces.parfumgallery.uz/images/editor/2023-05-19T11-40-15-948Z_Group 914.png" alt="" data-rotate="" data-proportion="true" data-size="," data-align="none" data-percentage="auto,auto" data-file-name="Mask group (3).png" data-file-size="634090" data-origin="," origin-size="1121,458" data-index="0" data-rotatex="" data-rotatey="" style="">
        
        
        
        
        
        
        
          </figure>
        </div>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <div class="__se__tag__bg__color" style="background-color: rgb(0, 0, 0);">    
        <p><br>
        </p>
        
        <h2><span style="font-family: Prata;color: rgb(255, 255, 255)">ПРОЧИТАВ ДАННУЮ<br>
        
        СТАТЬЮ ВЫ УЗНАЕТЕ:</span></h2>
         
        <p><span style="font-family: Prata;color: rgb(255, 255, 255)"><br>
        </span></p>
        
          <table class="se-table-layout-fixed">
                                        <tbody>
               <tr>
                 <td class="__se__top">
                             <div><span style="color: rgb(241, 242, 244);background-color: transparent">▪ Как&nbsp;распознать подделку</span></div>
                   <div><br>
                  </div>
                  <div><span style="color: rgb(241, 242, 244);background-color: transparent">▪ Какие вредные вещества используются в&nbsp;имитациях и&nbsp;какие болезни они&nbsp;вызывают</span></div>
                   <div><br>
        
                  </div>
         </td>
                 <td>
                   <div>​<span style="background-color: transparent;color: rgb(241, 242, 244)">▪ Почему большинство магазинов в&nbsp;Узбекистане не&nbsp;продают оригинал</span></div>
                   <div><br>
                  </div>
                  <div><span style="background-color: transparent;color: rgb(241, 242, 244)"></span><span style="color: rgb(241, 242, 244)">▪&nbsp;Где&nbsp;в&nbsp;Ташкенте купить 100% оригинальную парфюмерию и&nbsp;косметику</span></div>
        
        
        ​</td>
         </tr>
         </tbody>
         </table>
        
        <p><br>
        </p>
         </div>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <table class="se-table-layout-fixed">
                        <tbody>
             <tr>
               <td>
                 <h2><span style="font-family: Prata">КАК<br>
        </span><span style="font-family: Prata;background-color: transparent">РАСПОЗНАТЬ<br>
        </span><span style="font-family: Prata;background-color: transparent">ПОДДЕЛКУ</span></h2>
         </td>
               <td>
                 <table class="se-table-layout-fixed">
                                                                                        <tbody>
                     <tr>
                       <td>
                         <div class="se-component se-image-container __se__float-none">                                                                                                                              
                          <figure style="">
                                                                                                                                                                        <img src="https://spaces.parfumgallery.uz/images/editor/2023-05-17T13-06-08-567Z_image 19 (1).png" alt="2023-05-12T10-16-50-332Z_image 19.png" data-rotate="" data-proportion="true" data-size="," data-align="none" data-file-name="image 19.png" data-file-size="0" origin-size="260,170" data-origin="260px,170px" data-percentage="auto,auto" data-index="1" data-rotatex="" data-rotatey="" style="">
        
        
        
        
        
        
        
                          </figure>
         </div>
         </td>
                       <td class="__se__top">
                                                                                                                                        <h2><span style="font-family: Prata">3</span></h2>
                         <div>Флакон настоящего парфюма обычно делается из&nbsp;качественного материала и&nbsp;его&nbsp;приятно держать в&nbsp;руке.</div>
                         <div><br>
        
                        </div>
                         <div>Опытные парфюмеры нередко делают акцент на вес колпачка, делая его тяжелым и внушительным.<br>
        
                        </div>
                         <div><br>
        
                        </div>
                         <div> </div>
         </td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
        </table>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <table class="se-table-layout-fixed">
                        <tbody>
             <tr>
               <td>
                 <table class="se-table-layout-fixed">
                                                                                        <tbody>
                     <tr>
                       <td class="__se__top">
                                                                                                                                        <div class="se-component se-image-container __se__float-none">                                                                                                                              
                          <figure>
                             <img src="https://spaces.parfumgallery.uz/images/editor/2023-05-17T13-05-27-806Z_image 15.png" alt="" data-rotate="" data-proportion="true" data-size="," data-align="none" data-percentage="auto,auto" data-file-name="image 19.png" data-file-size="73485" data-origin="," origin-size="260,170" data-index="2" data-rotatex="" data-rotatey="" style="">
        
        
        
        
        
        
        
                          </figure>
         </div>
         </td>
                       <td class="__se__top">
                                                                                                                                        <h2>​<span style="font-family: Prata">1</span></h2>
                         <div><br>
        
                        </div>
                         <div>Качество печати упаковки должно быть хорошим. А&nbsp;надписи чёткие и&nbsp;аккуратные. В&nbsp;случае если&nbsp;коробка слегка деформирована, не&nbsp;спешите с&nbsp;выводами, причиной может быть неаккуратная доставка.<br>
        
        
        
        
        
        
        
                        </div>
         </td>
         </tr>
         </tbody>
         </table>
         </td>
               <td>
                 <table class="se-table-layout-fixed">
                                                                                        <tbody>
                     <tr>
                       <td class="__se__top">
                                         <div class="se-component se-image-container __se__float-none">                                                                                                                              
                          <figure>
                             <img src="https://spaces.parfumgallery.uz/images/editor/2023-05-19T10-40-19-690Z_Group 913.png" alt="" data-rotate="" data-proportion="true" data-size="," data-align="none" data-percentage="auto,auto" data-file-name="image 19.png" data-file-size="73485" data-origin="," origin-size="260,170" data-index="3" data-rotatex="" data-rotatey="" style="">
        
        
        
        
        
        
        
                          </figure>
         </div>
         </td>
                       <td class="__se__top">
                                                                                                                                        <h2>​<span style="font-family: Prata">4</span>​</h2>
                         <div><br>
        
        
        
        
        
        
        
                        </div>
                         <div>На&nbsp;знаке экологической упаковки (стрелки, образующие круг) чёрная стрелка всегда находится сверху по&nbsp;отношению к&nbsp;светлой. <br>
        <br>
        
        
        
        
        
        
        
        Не&nbsp;стесняйтесь прямо в&nbsp;магазине сверять информацию на&nbsp;сайте производителя.<br>
        
                        </div>
                         <div> </div>
         </td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
        </table>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <table class="se-table-layout-fixed">
                        <tbody>
             <tr>
               <td>
                 <table class="se-table-layout-fixed">
                                                                                        <tbody>
                     <tr>
                       <td>
                         <div class="se-component se-image-container __se__float-none">                                                                                                                              
                          <figure>
                             <img src="https://spaces.parfumgallery.uz/images/editor/2023-05-17T13-05-36-811Z_image 25.png" alt="" data-rotate="" data-proportion="true" data-size="," data-align="none" data-percentage="auto,auto" data-file-name="image 19.png" data-file-size="73485" data-origin="," origin-size="260,170" data-index="4" data-rotatex="" data-rotatey="" style="">
        
        
        
        
        
        
        
                          </figure>
         </div>
         </td>
                       <td>
                         <h2>​<span style="font-family: Prata">2</span>​</h2>
        
        
        
        
        
        
        
        ​                                                                                                                                <div>Допустимое содержание спирта в&nbsp;духах&nbsp;— 85%, в&nbsp;туалетной воде&nbsp;— не&nbsp;более 75%. <br>
        <br>
        
        
        
        
        
        
        
        При&nbsp;смешивании с&nbsp;качественными эфирными маслами, этил ассимилируется, характерный алкогольный «душок» пропадает, чего&nbsp;не&nbsp;скажешь о&nbsp;фальшивках.</div>
         </td>
         </tr>
         </tbody>
         </table>
         </td>
               <td>
                 <table class="se-table-layout-fixed">
                                                                                        <tbody>
                     <tr>
                       <td>
                         <div class="se-component se-image-container __se__float-none">                                                                                                                              
                          <figure>
                             <img src="https://spaces.parfumgallery.uz/images/editor/2023-05-17T13-05-44-547Z_image 26.png" alt="" data-rotate="" data-proportion="true" data-size="," data-align="none" data-percentage="auto,auto" data-file-name="image 19.png" data-file-size="73485" data-origin="," origin-size="260,170" data-index="5" data-rotatex="" data-rotatey="" style="">
        
        
        
        
        
        
        
                          </figure>
         </div>
         </td>
                       <td>
                         <h2>​<span style="font-family: Prata">5</span>​</h2>
        
        
        
        
        
        
        
        ​                                                                                                                                <div>Зачастую оригиналы производят бледных оттенков, они&nbsp;не&nbsp;имеют большого количества красителей в&nbsp;своём составе. Если&nbsp;перед вами яркое «химическое» содержимое флакона, то вероятно - это подделка.</div>
         </td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
        </table>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <div class="__se__tag__bg__color" style="background-color: rgb(0, 0, 0);">
        <p><br>
        </p>
        
        <p><span style="font-size: 20px"><span style="font-family: Prata;color: rgb(255, 255, 255)">Имейте в виду, что визуальный осмотр флаконов и&nbsp;упаковки не&nbsp;гарантирует на 100%,<br>
        
        
        
        что&nbsp;вы&nbsp;сможете определить подлинность продукции.</span></span></p>
        
        <p><span style="background-color: rgb(0, 0, 0);color: rgb(255, 255, 255);font-size: 20px">​</span></p>
        
        <h2><span style="font-family: Prata;color: rgb(255, 255, 255)">САМЫЙ ЭФФЕКТИВНЫЙ СПОСОБ УБЕДИТЬСЯ, ЧТО&nbsp;ПАРФЮМ ОРИГИНАЛ&nbsp;— ЭТО&nbsp;ЗАПРОСИТЬ </span><br>
        <span style="font-family: Prata;color: rgb(255, 255, 255)">
        
        У&nbsp;ПРОДАВЦА СЕРТИФИКАТ СООТВЕТСТВИЯ</span></h2>
        
        <p><br>
        </p>
        </div>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        <br>
        </p>
        <p></p>
        <table class="se-table-layout-fixed">
                <tbody>
             <tr>
               <td>
                 <h2><span style="font-family: Prata">ОСТОРОЖНО —
        </span><br>
        <span style="font-family: Prata">
        
        ОПАСНАЯ
        </span><br>
        <span style="font-family: Prata">
        
        ХИМИЯ</span></h2>
                 <div><br>
        
        
                </div>
                 <div>Ниже мы расскажем к чему может привести активное использование подделки<br>
        
        
        
                </div>
         </td>
               <td>
                 <div><span style="font-family: Prata;font-size: 25px">Нарушение дыхания и&nbsp;гормональных систем</span><br>
        
        
        
                </div>
                 <div><br>
        
        
        
                </div>
                 <div>Бензофенон в парфюмерии используется в качестве фиксатора и усилителя аромата. Бензофенон обладает общей токсичностью для организма. Расценивается как потенциальный канцероген и вещество, нарушающее работу эндокринной системы. Проникает в организм через кожу, при вдыхании и через продукты питания. Бензофенон оказывает влияние, в том числе, на окружающую среду, так как способен накапливаться в живых организмах. Внимательно читайте состав парфюмерии, чтобы исключить использование бензофенона в составе вашей косметики (может быть обозначен как «diphenyl ketone», «benzophenone», «BP», «diphenylmethanone», «phenyl ketone»).<br>
        
        
        
                </div>
         </td>
         </tr>
         </tbody>
        </table>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <table class="se-table-layout-fixed">
                <tbody>
             <tr>
               <td>
                 <div><span style="font-family: Prata;font-size: 25px">Мигрени и аллергии</span><br>
        
        
        
                </div>
                 <div><br>
        
        
        
                </div>
                 <div>Бензофенон в парфюмерии используется в качестве фиксатора и усилителя аромата. Бензофенон обладает общей токсичностью для организма. Расценивается как потенциальный канцероген и вещество, нарушающее работу эндокринной системы. Проникает в организм через кожу, при вдыхании и через продукты питания. Бензофенон оказывает влияние, в том числе, на окружающую среду, так как способен накапливаться в живых организмах. Внимательно читайте состав парфюмерии, чтобы исключить использование бензофенона в составе вашей косметики (может быть обозначен как «diphenyl ketone», «benzophenone», «BP», «diphenylmethanone», «phenyl ketone»).<br>
        
        
        
                </div>
         </td>
               <td>
                 <div><span style="font-family: Prata;font-size: 25px">Раковые заболевания</span><br>
        
        
        
                </div>
                 <div><br>
        
        
        
                </div>
                 <div>Дибутилфталат (DBP) используется в составе различной некачественной парфюмерии (духи, туалетная вода, одеколон) в качестве растворителя. Это вещество имеет свойство накапливаться в тканях организма, что приводит к раковым новообразованиям и другим болезням. Внимательно читайте состав парфюмерии, чтобы исключить использование дибутилфталата в составе вашей косметики (может быть обозначен также как DBP, Dibutyl phthalate).<br>
        
        
        
                </div>
         </td>
         </tr>
         </tbody>
        </table>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <table class="se-table-layout-fixed">
                <tbody>
             <tr>
               <td>
                 <div><span style="font-family: Prata;font-size: 25px">Заболевания кожи</span><br>
        
        
        
                </div>
                 <div><br>
        
        
        
                </div>
                 <div>Искусственные красители вызывают кожные реакции, сложно поддающиеся лечению.<br>
        
        
        
                </div>
         </td>
               <td>
                 <div><span style="font-family: Prata;font-size: 25px">Испорченный гардероб</span><br>
        
        
        
                </div>
                 <div><br>
        
        
        
                </div>
                 <div>Поддельные духи способны безвозвратно испортить ваш гардероб даже при минимальном распылении! При попадании на ткань, содержащиеся в составе парфюма ароматические добавки и спирты обесцвечивают цветные материалы и оставляют несмываемые желтые пятна.<br>
        
        
        
                </div>
         </td>
         </tr>
         </tbody>
        </table>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><span style="font-family: Prata;color: rgb(51, 51, 51);font-size: 35px">«</span><span style="font-family: Prata;font-size: 25px">Использование поддельной парфюмерии порой начинается с&nbsp;контактного дерматита. Затем может перейти в&nbsp;аллергический дерматит, а&nbsp;это&nbsp;уже более сложная форма.</span></p>
        <p></p>
        <p><span style="font-family: Prata;font-size: 25px">Далее это&nbsp;может перерасти в&nbsp;токсическую реакцию кожи, когда могут возникнуть&nbsp;</span><span style="font-family: Prata;font-size: 25px">очень тяжёлые состояния</span><span style="font-family: Prata;color: rgb(51, 51, 51);font-size: 35px">»</span>​</p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <table class="se-table-layout-fixed">
              <tbody>
             <tr>
               <td>
                 <div><br>
        
        
                </div>
         </td>
               <td>
                 <table class="se-table-layout-fixed">
                                      <tbody>
                     <tr>
                       <td>
                         <div><br>
        
        
                        </div>
         </td>
                       <td>
                         <div><span style="font-size: 25px"><span style="font-family: Prata">Врач-дерматолог,</span><br>
        
        
        ​<span style="font-family: Prata">Роман Редько</span></span>​<br>
        
        
                        </div>
         </td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
        </table>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        <br>
        <br>
        </p>
        <p></p>
        <div class="__se__tag__bg__color" style="background-color: rgb(0, 0, 0);">
        <p>​​<br>
        </p>
        
        <h2><span style="font-family: Prata;color: rgb(255, 255, 255)">ЕСТЬ ЛИ СМЫСЛ ЭКОНОМИТЬ НА ПОКУПКЕ ПАРФЮМА,&nbsp;</span><span style="font-family: Prata;color: rgb(255, 255, 255)">ЕСЛИ ПРИДЁТСЯ ПОТРАТИТЬ В ДЕСЯТКИ РАЗ БОЛЬШЕ ДЕНЕГ&nbsp;</span><span style="font-family: Prata;color: rgb(255, 255, 255)">НА СМЕНУ ГАРДЕРОБА И ЛЕЧЕНИЕ БОЛЕЗНЕЙ</span><br>
        </h2>
        
        <p><br>
        </p>
        </div>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        <br>
        <br>
        <br>
        </p>
        <p></p>
        <table class="se-table-layout-fixed">
                <tbody>
             <tr>
               <td>
                 <div><span style="font-family: Prata;font-size: 25px">Бренды дорожат своей репутацией, и&nbsp;с&nbsp;трепетом относятся к&nbsp;выбору магазина, где&nbsp;будет продаваться их&nbsp;продукт</span><br>
        
        
        
                </div>
         </td>
               <td>
                 <div><br>
        
        
        
                </div>
         </td>
         </tr>
         </tbody>
        </table>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <table class="se-table-layout-fixed">
                <tbody>
             <tr>
               <td>
                 <div>На&nbsp;рынке Узбекистана много поставщиков и&nbsp;производителей некачественной парфюмерии и&nbsp;косметики. Приобретая продукцию в&nbsp;области красоты и&nbsp;здоровья в&nbsp;неофициальных магазинах, вы&nbsp;рискуете купить подделку.<br>
        <br>
        
        
        
        Крупные бренды-производители парфюмерии очень дорожат своей репутацией, ведь&nbsp;они&nbsp;используют только качественные компоненты и&nbsp;сырьё, а&nbsp;также передовые современные технологии.<br>
        
        
        
                </div>
         </td>
               <td>
                 <div>Поэтому они&nbsp;с&nbsp;трепетом относятся к&nbsp;выбору магазина, в&nbsp;котором будет продаваться их&nbsp;продукт. Чтобы&nbsp;получить официальное разрешение на&nbsp;продажу брендовой продукции, нужно доказать, что&nbsp;качество обслуживания продавцов-консультантов, расположение и&nbsp;оформление магазина, соответствует всем требованиям.<br>
        <br>
        
        
        
        Нередко разрешение выдаются в&nbsp;эксклюзивном формате&nbsp;— это&nbsp;означает что&nbsp;сертификация на&nbsp;продажу предоставляется только одной сети магазинов.<br>
        
        
        
                </div>
         </td>
         </tr>
         </tbody>
        </table>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <div class="se-component se-image-container __se__float-none">      
          <figure>
             <img src="https://spaces.parfumgallery.uz/images/editor/2023-05-12T12-43-23-330Z_image 24.png" alt="" data-rotate="" data-proportion="true" data-size="," data-align="none" data-percentage="auto,auto" data-file-name="image 24.png" data-file-size="116143" data-origin="," origin-size="1041,415" data-index="6" data-rotatex="" data-rotatey="" style="">
        
        
        
          </figure>
        </div>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <h2><span style="font-family: Prata">BEGIM PARFUM GALLERY — ЕДИНСТВЕННЫЙ</span><br>
        <span style="font-family: Prata">
        
        В&nbsp;УЗБЕКИСТАНЕ СЕРТИФИЦИРОВАННЫЙ ПОСТАВЩИК</span><br>
        </h2>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <table class="se-table-layout-fixed">
                <tbody>
             <tr>
               <td>
                 <div>Begim Parfum gallery — единственный в Узбекистане сертифицированный поставщик мировых брендов парфюмерии и косметики в широком ассортименте. На сегодняшний день в Ташкенте 8 фирменных магазинов, где официально представлены более 150 всемирно известных брендов. Вся продукция поставляется напрямую от брендов-производителей, что исключает возможность приобретения подделки.<br>
        
        
        
        За 30 лет успешной деятельности в столице и других регионах Узбекистана, парфюмерная сеть заслужила доверие покупателей и бесспорно считается лидером рынка.<br>
        
        
        
                </div>
         </td>
               <td>
                 <div>Основная задача Begim Parfum gallery — предложить жителям Узбекистана лучшую парфюмерию и косметику со всего мира без риска приобрести подделку. Профессиональные консультанты всегда подскажут и посоветуют подходящий парфюм для каждого посетителя.<br>
        <br>
        
        
        
        Также в магазинах часто проходят выгодные акции, конкурсы и различные мастер классы в сферах красоты и здоровья от специально приглашенных специалистов. Подписывайтесь на соцсети Begim Parfum gallery, чтобы быть в курсе всех событий!<br>
        
        
        
                </div>
         </td>
         </tr>
         </tbody>
        </table>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <table class="se-table-layout-fixed">
              <tbody>
             <tr>
               <td>
                 <div class="se-component se-image-container __se__float-none">                    
                  <figure>
                     <a target="_blank" href="https://yandex.ru/search/?text=ntktuhfv+dt%2C&amp;lr=10335" data-image-link="image"><img src="https://spaces.parfumgallery.uz/images/editor/2023-05-19T12-15-11-808Z_ÐÐ°ÑÑÐ¸Ð½ÐºÐ° 2 (3).png" alt="" data-rotate="" data-proportion="true" data-size="," data-align="none" data-percentage="auto,auto" data-file-name="ÐÐ°ÑÑÐ¸Ð½ÐºÐ° 2 (1).png" data-file-size="256229" data-origin="," data-image-link="https://yandex.ru/search/?text=ntktuhfv+dt%2C&amp;lr=10335" origin-size="491,308" data-index="7" data-rotatex="" data-rotatey="" style="">
        
        
                    </a>
         </figure>
         </div>
         </td>
               <td>
                 <div class="se-component se-image-container __se__float-none">                    
                  <figure>
                     <a href="https://yandex.ru/search/?text=ntktuhfv+dt%2C&amp;lr=10335" data-image-link="image"><img src="https://spaces.parfumgallery.uz/images/editor/2023-05-19T12-14-49-675Z_ÐÐ°ÑÑÐ¸Ð½ÐºÐ° 3 (3).png" alt="" data-rotate="" data-proportion="true" data-size="," data-align="none" data-percentage="auto,auto" data-file-name="ÐÐ°ÑÑÐ¸Ð½ÐºÐ° 3 (1).png" data-file-size="306146" data-origin="," data-image-link="https://yandex.ru/search/?text=ntktuhfv+dt%2C&amp;lr=10335" origin-size="489,308" data-index="8" data-rotatex="" data-rotatey="" style="">
        
        
                    </a>
         </figure>
         </div>
         </td>
         </tr>
         </tbody>
        </table>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <div class="__se__tag__bg__color" style="background-color: rgb(0, 0, 0);">
        <p><br>
        </p>
        
        <h2><span style="font-family: Prata;color: rgb(255, 255, 255)">БЕРЕГИТЕ СЕБЯ И СВОИХ БЛИЗКИХ,</span></h2>
        
        <h2><span style="color: rgb(255, 255, 255);font-family: Prata">ПРИОБРЕТАЯ ЭКСКЛЮЗИВНЫЙ ПАРФЮМ С ГАРАНТИЕЙ&nbsp;КАЧЕСТВА ТОЛЬКО В МАГАЗИНАХ BEGIM PARFUM GALLERY</span></h2>
        
        <p><br>
        </p>
        </div>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <h2>​<span style="font-family: Prata">КОНТАКТЫ</span><br>
        
        ​</h2>
        <p></p>
        <p>Доставка и консультация:<br>
        </p>
        <p></p>
        <p><a href="tel:+998901220003" rel="noopener noreferrer" target="_blank"><span style="color: rgb(0, 0, 0)">90 122 00 03</span></a></p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p>Сайт:&nbsp;<a href="http://www.parfumgallery.uz/" rel="noopener noreferrer" target="_blank"><span style="color: rgb(0, 0, 0)"><u>www.parfumgallery.uz</u></span></a></p>
        <p></p>
        <p><span style="color: rgb(0, 0, 0)"><br>
        </span></p>
        <p></p>
        <p><a href="http://www.instagram.com/parfumgallery.uz" rel="noopener noreferrer" target="_blank"><span style="color: rgb(0, 0, 0)">Instagram</span></a><span style="color: rgb(0, 0, 0)">&nbsp;|&nbsp;</span><a href="https://t.me/begimparfumgallery" rel="noopener noreferrer" target="_blank"><span style="color: rgb(0, 0, 0)">Telegram</span></a><span style="color: rgb(0, 0, 0)">&nbsp;|&nbsp;</span><a href="https://www.facebook.com/parfumgallery.uz/" rel="noopener noreferrer" target="_blank"><span style="color: rgb(0, 0, 0)">Facebook</span></a></p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <p><span style="font-family: Prata;font-size: 25px">Список контактов и адресов официальных магазинов Begim Parfum gallery:</span></p>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <table class="se-table-layout-fixed">
              <tbody>
             <tr>
               <td>
                 <table class="se-table-layout-fixed">
                                      <tbody>
                     <tr>
                       <td>
                         <div>Главный магазин<br>
        
        
        ул. Шахрисабзская 5, Ц2<br>
        
        Телефон:&nbsp;<a href="tel:+998712338484"><span style="color: rgb(0, 0, 0)">71 233-84-84</span></a>​<br>
        
        
                        </div>
         </td>
                       <td>
                         <div>ТЦ «Samarqand Darvoza»<br>
        
        
        2 этаж, ул. Кораташ, 5А<br>
        
        
        Телефон:<span style="color: rgb(0, 0, 0)"> </span><a href="tel:+998712050364"><span style="color: rgb(0, 0, 0)">71 205-03-64</span></a>​<br>
        
        
                        </div>
         </td>
         </tr>
         </tbody>
         </table>
         </td>
               <td>
                 <table class="se-table-layout-fixed">
                                      <tbody>
                     <tr>
                       <td>
                         <div>ТЦ «Riviera»<br>
        
        
        1 этаж, ул. Нурафшон 5<br>
        
        
        Телефон: <a href="tel:+998980778484"><span style="color: rgb(0, 0, 0)">98 077-84-84</span></a>​<br>
        
        
                        </div>
         </td>
                       <td>
                         <div>ТЦ «Mirabad Plaza» <br>
        
        
        (бывший Kontinent)<br>
        
        
        1 этаж ул. Мирабадская, 2<br>
        
        
        Телефон: <a href="tel:+998712566166"><span style="color: rgb(0, 0, 0)">71 256-61-66</span></a>​<br>
        
        
                        </div>
         </td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
        </table>
        <p></p>
        <p><br>
        </p>
        <p></p>
        <table class="se-table-layout-fixed">
              <tbody>
             <tr>
               <td>
                 <table class="se-table-layout-fixed">
                                      <tbody>
                     <tr>
                       <td>
                         <div>ТЦ «Next»<br>
        
        
        1 этаж, ул. Бобур, 6<br>
        
        
        Телефон: <a href="tel:+998712307534"><span style="color: rgb(0, 0, 0)">71 230-75-34</span></a>​<br>
        
        
                        </div>
         </td>
                       <td>
                         <div>ТЦ «AeroPlaza»<br>
        
        
        1 этаж, ул. Кичик Халка йули, 88<br>
        
        
        Телефон: <a href="tel:+998712559020"><span style="color: rgb(0, 0, 0)">71 255-90-20</span></a>​<br>
        
        
                        </div>
         </td>
         </tr>
         </tbody>
         </table>
         </td>
               <td>
                 <table class="se-table-layout-fixed">
                                      <tbody>
                     <tr>
                       <td>
                         <div>ТЦ «Mercato»<br>
        
        
        1 этаж, ул. Кичик Халка йули, 57<br>
        
        
        Телефон: <a href="tel:+998712309601"></a><a href="tel:+998712309601"><span style="color: rgb(0, 0, 0)">71 230-96-01</span></a>​<br>
        
        
                        </div>
         </td>
                       <td>
                         <div>ТЦ «Mega Planet»<br>
        
        
        2 этаж, ул. Ахмад Дониш 2Б, Юнусабад 11 кв<br>
        
        
        Телефон: <a href="tel:+998781508758"><span style="color: rgb(0, 0, 0)">78 150-87-58</span></a>​<br>
        
        
                        </div>
         </td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
        </table>
        <p></p>
        <p><br>
        </p>
        <p></p>
        `,
      },
    ],
    colorList: [
      [
        "#828282",
        "#FF5400",
        "#676464",
        "#FFF",
        "#FF9B00",
        "#F00",
        "#fa6e30",
        "#000",
        "rgba(255, 153, 0, 0.1)",
        "#FF6600",
        "#0099FF",
        "#74CC6D",
        "#FF9900",
        "#CCCCCC",
      ],
    ],
    defaultStyle: "font-size:14px;",
    attributesWhitelist: {
      all: "class", // Apply to all tags
      div: "style|class|data-.+", // Apply to all tags
      td: "style|class|data-.+", // Apply to all tags
      table: "style|class|data-.+", // Apply to all tags
      span: "style|class|data-.+", // Apply to all tags
    },
    imageUploadUrl: apiBaseUrl + "/editor",
    imageGalleryUrl: apiBaseUrl + "/gallery",
    imageUploadHeader: {
      "x-auth-token": getJwt(),
    },

    videoFileInput: true,
    videoUploadHeader: {
      "x-auth-token": getJwt(),
    },
    videoUploadUrl: apiBaseUrl + "/editor/video",
    videoUploadSizeLimit: 50 * 1024 * 1024, //MB
  };

  // const onImageUploadError = (errorMessage, result, core) => {
  //   alert(errorMessage);
  // core.noticeOpen(errorMessage);
  // return false;
  // console.log('error!')
  // return true;
  // }

  // useEffect(() => {
  //   if (!contentRef.current) return;
  //  contentRef.current.innerHTML = value;
  // }, [value]);

  const onChangeHandler = (content) => {
    onChange(content);
  };

  const handleImageUploadError = (errorMessage, result) => {
    // console.log("image upload error: ", errorMessage, result);
  };

  const handleImageUpload = (targetImgElement, index, state, imageInfo, remainingFilesCount) => {
    console.log(targetImgElement, index, state, imageInfo, remainingFilesCount);
  };

  const imageUploadHandler = (xmlHttpRequest, info, core) => {
    console.log(xmlHttpRequest, info, core);
  };

  const onImageUploadBefore = async (files, info, core, uploadHandler) => {
    // Upload image to Server
    console.log(uploadHandler);
    try {
      const result = await postEditor(files[0]);

      const data = result.data;
      // result
      const response = {
        // The response must have a "result" array.
        result: [
          {
            url: data.src,
            name: files[0].name,
            size: files[0].size,
          },
        ],
      };

      uploadHandler(response);
      return false;
    } catch (err) {
      console.log("err: ", err);
    }
  };

  return (
    <>
      {plugins ? (
        <Editor
          lang={"ru"}
          setOptions={editorOptions}
          // onImageUploadBefore={onImageUploadBefore}
          // onImageUploadError={handleImageUploadError}
          // onImageUpload={handleImageUpload}
          // imageUploadHandler={imageUploadHandler}
          onChange={onChangeHandler}
          defaultValue={value}
        />
      ) : (
        <Loading />
      )}
      {/* <div ref={contentRef}></div> */}
    </>
  );
}
