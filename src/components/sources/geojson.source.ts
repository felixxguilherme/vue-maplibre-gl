import { createCommentVNode, defineComponent, inject, PropType, provide, watch } from 'vue';
import { componentIdSymbol, emitterSymbol, isLoadedSymbol, mapSymbol, sourceIdSymbol } from '@/components/types';
import { GeoJSONSource, GeoJSONSourceOptions, PromoteIdSpecification } from 'maplibre-gl';
import { bindSource, getSourceRef } from '@/components/sources/shared';

const sourceOpts: Array<keyof GeoJSONSourceOptions> = [
	'data', 'maxzoom', 'attribution', 'buffer', 'tolerance', 'cluster', 'clusterRadius', 'clusterMaxZoom', 'clusterMinPoints', 'clusterProperties',
	'lineMetrics', 'generateId', 'promoteId', 'filter'
];

export default defineComponent({
	name : 'MglGeoJsonSource',
	props: {
		sourceId         : {
			type    : String as PropType<string>,
			required: true
		},
		data             : [ Object, String ] as PropType<GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | string>,
		maxzoom          : Number as PropType<number>,
		attribution      : String as PropType<string>,
		buffer           : Number as PropType<number>,
		tolerance        : Number as PropType<number>,
		cluster          : [ Number, Boolean ] as PropType<number | boolean>,
		clusterRadius    : Number as PropType<number>,
		clusterMaxZoom   : Number as PropType<number>,
		clusterMinPoints : Number as PropType<number>,
		clusterProperties: Object as PropType<object>,
		lineMetrics      : Boolean as PropType<boolean>,
		generateId       : Boolean as PropType<boolean>,
		promoteId        : Object as PropType<PromoteIdSpecification>,
		filter           : [ Array, String, Object ] as PropType<any>
	},
	setup(props) {

		const map      = inject(mapSymbol)!,
			  isLoaded = inject(isLoadedSymbol)!,
			  emitter  = inject(emitterSymbol)!,
			  cid      = inject(componentIdSymbol)!,
			  source   = getSourceRef<GeoJSONSource>(cid, props.sourceId);

		provide(sourceIdSymbol, props.sourceId);

		bindSource(map, source, isLoaded, emitter, props, 'geojson', sourceOpts);
		watch(() => props.data, v => source.value?.setData(v || ''));

		return { source };
	},
	render() {
		return [
			createCommentVNode('GeoJSON Source'),
			this.source && this.$slots.default ? this.$slots.default() : undefined
		];
	}
});
