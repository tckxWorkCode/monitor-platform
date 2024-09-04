<template>
  <el-table
    :data="tableData"
    :max-height="maxHeight"
    :height="height"
    v-loading="props.loading"
    :row-key="props.rowKey"
    default-expand-all
    ref="table"
    :stripe="true"
    :header-cell-style="{ background: '#012548 !important' }">
  >
  <template v-for="(item,index) in colConfigs">
        <el-table-column
          v-if="item.slot && item.slot === 'selection'"
          type="selection"
          :width="item.width"
          :reserve-selection="true"
          :key="index"
        />
        <el-table-column
          :key="index"
          v-if="item.slot && item.slot === 'index'"
          type="index"
          width="70"
          label="序号"
        />
        <slot v-if="item.slot" :name="item.slot" :label="item.slot"></slot>
        <!-- 如果不是选择框 -->
        <el-table-column
          v-else-if="item.type !== 'selection'"
          :prop="item.prop"
          :show-overflow-tooltip="true"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed"
          :key="index"
          />
          <!-- sortable -->
        <!-- 选择框 -->
      </template>
    <template #empty>
      <!-- <div style="height: 24px"></div> -->
      <img style="height: 120px;" alt="" class="table-empty" src="@/assets/nodata.png" />
    </template>
  </el-table>
</template>

<script lang="ts">
import { isNullArray } from "@/utils";
import { defineComponent, reactive, toRefs } from "vue";
import "./index.scss";

export default defineComponent({
  name: "app",
  props: [
    "colConfigs",
    "tableData",
    "maxHeight",
    "height",
    "loading",
    "rowKey",
    "selectable",
  ],
  emits: [],
  setup(props, { emit }) {
    const state = reactive({
      table: null,
      propsReserveKeys: [],
    });
    const funMethods = {
      clearSelection: () => {
        state.table?.clearSelection();
      },
      getSelectionRows: () => {
        return state.table?.getSelectionRows();
      },
      getSelectionKeys: () => {
        return funMethods.getSelectionRows()?.map((m) => m.rule_id);
      },
      getSelectionIdKeys: () => {
        return funMethods.getSelectionRows()?.map((m) => m.id);
      },
      setReserveKeys: (keys) => {
        state.propsReserveKeys = keys;
      },
      toggleRowSelection: () => {
        if (isNullArray(state.propsReserveKeys)) {
          return;
        }
        var nowHasRows = props.tableData?.filter(
          (m) => state.propsReserveKeys.indexOf(m[props.rowKey]) != -1
        );
        for (let index = 0; index < nowHasRows.length; index++) {
          const element = nowHasRows[index];
          state.table.toggleRowSelection(element, true);
          state.propsReserveKeys = state.propsReserveKeys.filter(
            (m) => m != element[props.rowKey]
          );
        }
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
