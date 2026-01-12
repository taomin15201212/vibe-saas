import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendTeamInviteEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

// POST /api/teams/invite - Send team invitation
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { teamId, email, role = 'member' } = body;

    if (!teamId || !email) {
      return NextResponse.json({ error: '团队ID和邮箱不能为空' }, { status: 400 });
    }

    // Verify user is team owner
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, name, owner_id')
      .eq('id', teamId)
      .single();

    if (teamError || !team) {
      return NextResponse.json({ error: '团队不存在' }, { status: 404 });
    }

    if (team.owner_id !== user.id) {
      return NextResponse.json({ error: '只有团队所有者可以邀请成员' }, { status: 403 });
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('user_id', (
        await supabase.from('profiles').select('id').eq('email', email).single()
      ).data?.id)
      .single();

    if (existingMember) {
      return NextResponse.json({ error: '该用户已是团队成员' }, { status: 400 });
    }

    // Create invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('team_invitations')
      .insert({
        team_id: teamId,
        email,
        role,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (inviteError) {
      console.error('Error creating invitation:', inviteError);
      return NextResponse.json({ error: '创建邀请失败' }, { status: 500 });
    }

    // Send invite email (placeholder)
    // await sendTeamInviteEmail(email, team.name, invitation.token);

    return NextResponse.json({
      message: '邀请已发送',
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expires_at: invitation.expires_at,
      },
    });
  } catch (error) {
    console.error('Invite error:', error);
    return NextResponse.json({ error: '发送邀请失败' }, { status: 500 });
  }
}

// GET /api/teams/invite - Get pending invitations for user
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ invitations: [] });
    }

    // Get pending invitations for this email
    const { data: invitations, error: inviteError } = await supabase
      .from('team_invitations')
      .select(`
        *,
        teams:team_id (id, name, owner_id)
      `)
      .eq('email', profile.email)
      .gt('expires_at', new Date().toISOString())
      .is('accepted_at', null);

    if (inviteError) {
      console.error('Error fetching invitations:', inviteError);
      return NextResponse.json({ error: '获取邀请失败' }, { status: 500 });
    }

    return NextResponse.json({ invitations: invitations || [] });
  } catch (error) {
    console.error('Get invitations error:', error);
    return NextResponse.json({ error: '获取邀请失败' }, { status: 500 });
  }
}

// PATCH /api/teams/invite - Accept/Reject invitation
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { invitationId, action } = body;

    if (!invitationId || !action) {
      return NextResponse.json({ error: '邀请ID和操作不能为空' }, { status: 400 });
    }

    // Get invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('id', invitationId)
      .gt('expires_at', new Date().toISOString())
      .is('accepted_at', null)
      .single();

    if (inviteError || !invitation) {
      return NextResponse.json({ error: '邀请不存在或已过期' }, { status: 404 });
    }

    // Verify user's email matches
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (profile?.email !== invitation.email) {
      return NextResponse.json({ error: '此邀请不属于你' }, { status: 403 });
    }

    if (action === 'accept') {
      // Add user to team
      await supabase
        .from('team_members')
        .insert({
          team_id: invitation.team_id,
          user_id: user.id,
          role: invitation.role,
        });

      // Mark invitation as accepted
      await supabase
        .from('team_invitations')
        .update({ accepted_at: new Date().toISOString() })
        .eq('id', invitationId);

      return NextResponse.json({ message: '已加入团队' });
    } else if (action === 'reject') {
      // Delete invitation
      await supabase
        .from('team_invitations')
        .delete()
        .eq('id', invitationId);

      return NextResponse.json({ message: '已拒绝邀请' });
    }

    return NextResponse.json({ error: '无效操作' }, { status: 400 });
  } catch (error) {
    console.error('Accept/reject invitation error:', error);
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}
