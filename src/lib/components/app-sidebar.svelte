<script lang="ts">
  import { resolve } from "$app/paths";
  import DashboardIcon from "@lucide/svelte/icons/layout-dashboard";
  import FolderIcon from "@lucide/svelte/icons/folder";
  import TimerIcon from "@lucide/svelte/icons/timer";
  import SettingsIcon from "@lucide/svelte/icons/settings";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";

  // Menu items.
  const items = [
    {
      title: "Dashboard",
      url: "/",
      icon: DashboardIcon,
    },
    {
      title: "Jobs",
      url: "/jobs",
      icon: TimerIcon,
    },
    {
      title: "Folders",
      url: "/jobs/folders",
      icon: FolderIcon,
    },
  ] as const;
</script>

<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Separator />

    <Sidebar.Group class="mt-12 space-y-2">
      <!-- <Sidebar.GroupLabel class="font-bold text-base">Application</Sidebar.GroupLabel> -->
      <Sidebar.Separator class="mx-0" />
      <Sidebar.GroupContent>
        <Sidebar.Menu class="space-y-2">
          {#each items as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton class="text-base">
                {#snippet child({ props })}
                  <a href={resolve(item.url)} {...props}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
          <Sidebar.Separator class="mx-0" />
          <Sidebar.MenuItem>
            <Sidebar.MenuButton class="text-base">
              {#snippet child({ props })}
                <a href={resolve("/")} {...props}>
                  <SettingsIcon />
                  <span>Settings</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>
