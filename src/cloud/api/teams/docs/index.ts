import { callApi } from '../../../lib/client'
import { SerializedTeam } from '../../../interfaces/db/team'
import {
  SerializedDocWithBookmark,
  SerializedDoc,
} from '../../../interfaces/db/doc'
import { SerializedFolderWithBookmark } from '../../../interfaces/db/folder'
import report from '../../../lib/analytics'
import { SerializedWorkspace } from '../../../interfaces/db/workspace'

export interface CreateDocRequestBody {
  workspaceId?: string
  parentFolderId?: string
  template?: string
  title?: string
  emoji?: string
}

export interface CreateDocResponseBody {
  doc: SerializedDocWithBookmark
}

export async function createDoc(
  team: SerializedTeam,
  body: CreateDocRequestBody
) {
  const data = await callApi<CreateDocResponseBody>(
    `api/teams/${team.id}/docs`,
    {
      json: body,
      method: 'post',
    }
  )
  report('create_doc', { team, doc: data.doc })
  return data
}

export interface UpdateDocRequestBody {
  workspaceId: string
  parentFolderId?: string
}

export interface UpdateDocResponseBody {
  workspaces: SerializedWorkspace[]
  folders: SerializedFolderWithBookmark[]
  doc: SerializedDocWithBookmark
}

export async function updateDoc(
  teamId: string,
  docId: string,
  body: UpdateDocRequestBody
) {
  const data = await callApi<UpdateDocResponseBody>(
    `api/teams/${teamId}/docs/${docId}`,
    {
      json: body,
      method: 'put',
    }
  )
  report('update_doc')
  return data
}

export interface DestroyDocResponseBody {
  parentFolder?: SerializedFolderWithBookmark
  workspace?: SerializedWorkspace
  doc?: SerializedDocWithBookmark
}

export async function destroyDoc(team: SerializedTeam, doc: SerializedDoc) {
  const data = await callApi<DestroyDocResponseBody>(
    `api/teams/${team.id}/docs/${doc.id}`,
    {
      method: 'delete',
    }
  )
  report('delete_doc', { team, doc })

  return data
}

export async function updateDocEmoji(doc: SerializedDoc, emoji?: string) {
  const data = await callApi<UpdateDocResponseBody>(
    `api/teams/${doc.teamId}/docs/${doc.id}/emoji`,
    {
      json: { emoji },
      method: 'put',
    }
  )
  report('update_doc')
  return data
}

export interface ArchiveDocResponseBody {
  doc: SerializedDocWithBookmark
}

export async function archiveDoc(teamId: string, docId: string) {
  const data = await callApi<ArchiveDocResponseBody>(
    `api/teams/${teamId}/docs/${docId}/archive`,
    {
      method: 'put',
    }
  )
  return data
}

export async function unarchiveDoc(teamId: string, docId: string) {
  const data = await callApi<ArchiveDocResponseBody>(
    `api/teams/${teamId}/docs/${docId}/archive`,
    {
      method: 'delete',
    }
  )
  return data
}
