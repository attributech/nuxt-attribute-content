import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AttributeMap from '../components/AttributeMap.vue'

// Mock Leaflet components since they require browser environment
const mockLMap = {
  name: 'LMap',
  template: '<div class="mock-lmap" data-testid="lmap"><slot /></div>',
  props: ['zoom', 'center', 'options', 'useGlobalLeaflet'],
}

const mockLTileLayer = {
  name: 'LTileLayer',
  template: '<div class="mock-tile-layer" data-testid="tile-layer"></div>',
  props: ['url', 'attribution', 'layerType', 'name'],
}

const mockLMarker = {
  name: 'LMarker',
  template: '<div class="mock-marker" data-testid="marker"><slot /></div>',
  props: ['latLng'],
}

const mockLIcon = {
  name: 'LIcon',
  template: '<div class="mock-icon" data-testid="icon"></div>',
  props: ['iconSize', 'iconAnchor', 'iconUrl'],
}

const defaultGlobalStubs = {
  stubs: {
    LMap: mockLMap,
    LTileLayer: mockLTileLayer,
    LMarker: mockLMarker,
    LIcon: mockLIcon,
  },
}

describe('AttributeMap', () => {
  const defaultProps = {
    coordinates: [47.0005, 8.0005],
  }

  describe('Basic Rendering', () => {
    it('should render with required props', async () => {
      const wrapper = await mountSuspended(AttributeMap, {
        props: defaultProps,
        global: defaultGlobalStubs,
      })

      expect(wrapper.find('[data-testid="lmap"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="tile-layer"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="marker"]').exists()).toBe(true)
    })

    it('should pass correct zoom prop', async () => {
      const wrapper = await mountSuspended(AttributeMap, {
        props: {
          ...defaultProps,
          zoom: 12,
        },
        global: defaultGlobalStubs,
      })

      const lmap = wrapper.findComponent({ name: 'LMap' })
      expect(lmap.props('zoom')).toBe(12)
    })

    it('should use default zoom when not provided', async () => {
      const wrapper = await mountSuspended(AttributeMap, {
        props: defaultProps,
        global: defaultGlobalStubs,
      })

      const lmap = wrapper.findComponent({ name: 'LMap' })
      expect(lmap.props('zoom')).toBe(17)
    })
  })

  describe('Coordinates', () => {
    it('should use provided coordinates for center and marker', async () => {
      const coordinates = [46.5197, 6.6323]
      const wrapper = await mountSuspended(AttributeMap, {
        props: { coordinates },
        global: defaultGlobalStubs,
      })

      const lmap = wrapper.findComponent({ name: 'LMap' })
      const marker = wrapper.findComponent({ name: 'LMarker' })

      expect(lmap.props('center')).toEqual(coordinates)
      expect(marker.props('latLng')).toEqual(coordinates)
    })
  })

  describe('Icon Configuration', () => {
    it('should render marker without custom icon by default', async () => {
      const wrapper = await mountSuspended(AttributeMap, {
        props: defaultProps,
        global: defaultGlobalStubs,
      })

      const markers = wrapper.findAllComponents({ name: 'LMarker' })
      const icons = wrapper.findAllComponents({ name: 'LIcon' })

      expect(markers).toHaveLength(1)
      expect(icons).toHaveLength(0)
    })

    it('should render marker with custom icon when provided', async () => {
      const customIcon = {
        size: [32, 32],
        anchor: [16, 32],
        url: '/test-icon.svg',
      }

      const wrapper = await mountSuspended(AttributeMap, {
        props: {
          ...defaultProps,
          icon: customIcon,
        },
        global: defaultGlobalStubs,
      })

      const markers = wrapper.findAllComponents({ name: 'LMarker' })
      const icons = wrapper.findAllComponents({ name: 'LIcon' })

      expect(markers).toHaveLength(1)
      expect(icons).toHaveLength(1)

      const icon = icons[0]
      expect(icon.props('iconSize')).toEqual(customIcon.size)
      expect(icon.props('iconAnchor')).toEqual(customIcon.anchor)
      expect(icon.props('iconUrl')).toBe(customIcon.url)
    })
  })

  describe('Map Configuration', () => {
    it('should configure map with disabled interactions', async () => {
      const wrapper = await mountSuspended(AttributeMap, {
        props: defaultProps,
        global: defaultGlobalStubs,
      })

      const lmap = wrapper.findComponent({ name: 'LMap' })
      const options = lmap.props('options')

      expect(options.zoomControl).toBe(false)
      expect(options.dragging).toBe(false)
      expect(options.scrollWheelZoom).toBe(false)
    })

    it('should disable global leaflet usage', async () => {
      const wrapper = await mountSuspended(AttributeMap, {
        props: defaultProps,
        global: defaultGlobalStubs,
      })

      const lmap = wrapper.findComponent({ name: 'LMap' })
      expect(lmap.props('useGlobalLeaflet')).toBe(false)
    })
  })

  describe('Tile Layer', () => {
    it('should use default tile layer style', async () => {
      const wrapper = await mountSuspended(AttributeMap, {
        props: defaultProps,
        global: defaultGlobalStubs,
      })

      const tileLayer = wrapper.findComponent({ name: 'LTileLayer' })
      const url = tileLayer.props('url')

      expect(url).toContain('mapbox/light-v11')
      expect(url).toContain('api.mapbox.com')
    })

    it('should use custom tile layer style when provided', async () => {
      const customStyle = 'mapbox/satellite-v9'
      const wrapper = await mountSuspended(AttributeMap, {
        props: {
          ...defaultProps,
          tileLayerStyle: customStyle,
        },
        global: defaultGlobalStubs,
      })

      const tileLayer = wrapper.findComponent({ name: 'LTileLayer' })
      const url = tileLayer.props('url')

      expect(url).toContain(customStyle)
    })

    it('should set correct tile layer properties', async () => {
      const wrapper = await mountSuspended(AttributeMap, {
        props: defaultProps,
        global: defaultGlobalStubs,
      })

      const tileLayer = wrapper.findComponent({ name: 'LTileLayer' })

      expect(tileLayer.props('attribution')).toContain('OpenStreetMap')
      expect(tileLayer.props('layerType')).toBe('base')
      expect(tileLayer.props('name')).toBe('OpenStreetMap')
    })
  })
})
