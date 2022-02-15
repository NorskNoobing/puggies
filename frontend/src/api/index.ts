/*
 * Copyright 2022 Puggies Authors (see AUTHORS.txt)
 *
 * This file is part of Puggies.
 *
 * Puggies is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * Puggies is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public
 * License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Puggies. If not, see <https://www.gnu.org/licenses/>.
 */

import { Match, MatchInfo, UserMeta } from "../types";

export class DataAPI {
  private endpoint = "/api/v1";
  private jwtKeyName = "puggies-login-token";

  public async login(username: string, password: string): Promise<void> {
    const res = await fetch(`${this.endpoint}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const json = await res.json();

    if (res.status === 200) {
      localStorage.setItem(this.jwtKeyName, json.message);
      return;
    } else {
      throw new Error(
        `Failed to login (HTTP ${res.status}): HTTP ${json.message}`
      );
    }
  }

  public async fetchMatch(id: string): Promise<Match | undefined> {
    const res = await fetch(`${this.endpoint}/matches/${id}`);
    if (res.status === 404) {
      return undefined;
    }
    return await res.json();
  }

  public async fetchUserMeta(id: string): Promise<UserMeta | undefined> {
    const res = await fetch(`${this.endpoint}/usermeta/${id}`);
    if (res.status === 404) {
      return undefined;
    }

    const json = res.json();
    // this is our "404" state for the user meta since we
    // want to avoid flooding the console with 404 errors
    if (json === null) {
      return undefined;
    }
    return json;
  }

  public async fetchMatches(): Promise<MatchInfo[]> {
    const results = (await (
      await fetch(`${this.endpoint}/history`)
    ).json()) as MatchInfo[];

    return results.sort((a, b) => b.dateTimestamp - a.dateTimestamp);
  }
}
