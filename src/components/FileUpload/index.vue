<template>
  <div class="fileUpload">
    <div>
      <el-button
        type="primary"
        @click="selectFile"
        :disabled="props.disable"
      >
        {{ currentFile?.name ? "重选文件" : "上传规则包" }}
      </el-button>
    </div>
    <div class="tip">
      <div class="selected" v-if="currentFile?.name">
        <div class="fileName">
          <el-tooltip :content="currentFile?.name" placement="top">
            {{ currentFile?.name }}
          </el-tooltip>
        </div>
        <template v-if="!hideOpt">
          <el-divider direction="vertical" />
          <!-- <div>
            <a class="download" @click="downloadFile">
              <i class="iconfont icon-download"></i>
            </a>
          </div>
          <el-divider direction="vertical" /> -->
          <div>
            <a class="clearFile" @click="clearFile">
              <i class="iconfont icon-close"></i>
            </a>
          </div>
        </template>
      </div>
      <div v-else class="unSelect">未选择文件</div>
    </div>
    <input
      style="display: none"
      type="file"
      :id="inputId"
      :accept="props.accept"
      @input="onFileChange"
    />
  </div>
  <div class="fileRemark">{{ props.fileTip }}</div>
</template>

<script lang="ts">
import { isNull, isNullArray, newGuid } from "../../utils/index";
import { ElMessageBox } from "element-plus/es";
import { defineComponent, reactive, toRefs } from "vue";
import "./index.scss";

export default defineComponent({
  props: ["value", "accept", "maxSize", "disable", "fileTip", "hideOpt"],
  emits: ["onChange"],
  name: "app",
  setup(props, { emit }) {
    const state = reactive({
      inputId: newGuid(),
      currentFile: {
        name: props.value?.name,
        file: props.value?.file,
      },
    });
    const funMethods = {
      updateVal: (val) => {
        emit("onChange", val);
      },
      getInput: () => {
        return document.getElementById(state.inputId);
      },
      selectFile: () => {
        (funMethods.getInput() as any).click();
      },
      clearFile: () => {
        funMethods.onlyClearSelf();
        funMethods.updateVal(null);
      },
      setFile: (currentFile) => {
        console.log(currentFile);
        state.currentFile = currentFile;
      },
      onlyClearSelf: () => {
        (funMethods.getInput() as any).value = "";
        state.currentFile = {
          name: null,
          file: null,
        };
      },
      onFileChange: (e) => {
        const files = e.target.files;
        if (isNullArray(files)) {
          funMethods.clearFile();
          return;
        }
        const file = files[0];

        if (!isNull(props.accept)) {
          var accepts = props.accept?.split(",");
          if (!isNull(accepts) && accepts!.length > 0) {
            // if (accepts?.indexOf(file.type) === -1) {
            //   ElMessageBox.alert("请上传指定类型的文件", "提示", {
            //     type: "error",
            //   });
            //   funMethods.clearFile();
            //   return;
            // }
          }
        }
        if (props.maxSize && props.maxSize > 0 && file.size > props.maxSize) {
          ElMessageBox.alert("文件大小超过最大限制", "提示", {
            type: "error",
          });
          funMethods.clearFile();
          return;
        }
        funMethods.updateVal(file)
        state.currentFile = { name: file.name, file };
        // funMethods.updateVal({ name: file.name, file: file });
        // var reader = new FileReader();
        // reader.onload = function (e) {
        //   // e.target.result 就是文件的二进制数据（ArrayBuffer 或 DataURL）
        //   var binaryData = e.target.result;
        //   console.log('',binaryData);
        // };
        // var reader = new FileReader();
        // reader.onload = function (e) {
        //   var arrayBuffer:any = e.target.result;
        //   const newData = new FormData()
        //   newData.append('file',arrayBuffer)
        //   console.log(newData); // 输出二进制字符串
        //   funMethods.updateVal(newData)
        // };
        // reader.readAsArrayBuffer(file);
      },
      dataURLtoBlob(dataurl) {
        var arr = dataurl.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
          type: mime,
        });
      },
      downloadFile: () => {
        let link = document.createElement("a");
        link.href = state.currentFile.file;
        link.download = state.currentFile.name;
        link.click();
      },
    };
    return {
      ...toRefs(state),
      ...funMethods,
      props,
    };
  },
});
</script>
<style lang="scss" scoped></style>
