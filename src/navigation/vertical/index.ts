import type {VerticalNavItems} from '@/@layouts/types'

export default [
  {
    title: 'Dashboard',
    to: {name: 'dashboard'},
    icon: {icon: 'mdi-view-dashboard'},
  },
  {
    title: 'News',
    icon: {icon: 'mdi-newspaper'},
    children: [
      {
        title: 'Posts',
        icon: {icon: 'mdi-file-document'},
        children: [
          {
            title: 'Posts List',
            to: {name: 'posts-list'},
            icon: {icon: 'mdi-format-list-bulleted'},
          },
          {
            title: 'New Post',
            to: {name: 'new-post'},
            icon: {icon: 'mdi-plus'},
          },
          {
            title: 'Marking',
            to: {name: 'post-marking'},
            icon: {icon: 'mdi-check'},
          },
        ],
      },
      {
        title: 'Categories',
        icon: {icon: 'mdi-folder'},
        children: [
          {
            title: 'All Categories',
            to: {name: 'categories-list'},
            icon: {icon: 'mdi-format-list-bulleted'},
          },
          {
            title: 'New Category',
            to: {name: 'new-category'},
            icon: {icon: 'mdi-folder-plus'},
          },
        ],
      },
    ],
  },
  {
    title: 'Appearance',
    icon: {icon: 'mdi-palette'},
    children: [
      {
        title: 'Pages',
        icon: {icon: 'mdi-file-document'},
        children: [
          {
            title: 'Pages List',
            to: {name: 'pages-list'},
            icon: {icon: 'mdi-format-list-bulleted'},
          },
          {
            title: 'New Page',
            to: {name: 'new-page'},
            icon: {icon: 'mdi-plus'},
          },
        ],
      },
      {
        title: 'Theme',
        icon: {icon: 'mdi-palette'},
        children: [
          {
            title: 'Themes Store',
            to: {name: 'themes-store'},
            icon: {icon: 'mdi-store'},
          },
          {
            title: 'My Themes',
            to: {name: 'my-themes'},
            icon: {icon: 'mdi-image-multiple'},
          },
          {
            title: 'New Theme',
            to: {name: 'new-theme'},
            icon: {icon: 'mdi-plus'},
          },
          {
            title: 'Theme Editor',
            to: {name: 'theme-editor'},
            icon: {icon: 'mdi-pencil'},
          },
        ],
      },
    ],
  },
  {
    title: 'System',
    icon: {icon: 'mdi-cog'},
    children: [
      {
        title: 'Plugins',
        icon: {icon: 'mdi-puzzle'},
        children: [
          {
            title: 'Plugins List',
            to: {name: 'plugins-list'},
            icon: {icon: 'mdi-format-list-bulleted'},
          },
          {
            title: 'Plugins Store',
            to: {name: 'plugins-store'},
            icon: {icon: 'mdi-store'},
          },
          {
            title: 'New Plugin',
            to: {name: 'new-plugin'},
            icon: {icon: 'mdi-plus'},
          },
        ],
      },
      {
        title: 'Settings',
        to: {name: 'settings'},
        icon: {icon: 'mdi-settings'},
      },
    ],
  },


] as VerticalNavItems
